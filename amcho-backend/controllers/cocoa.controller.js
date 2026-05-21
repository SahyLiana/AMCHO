import prisma from "../db.js";

export const getAllCocoa = async (req, res) => {
  try {
    const startYear = parseInt(req.query.startYear) || 2020;
    const endYear = parseInt(req.query.endYear) || 2026;

    // Executing all queries concurrently in a parallel thread pool
    const [
      cocoaPrice,
      cocoaPriceChange,
      cocoaPriceChangePercentage,
      cocoaPPI,
      cocoaPPIChange,
      cocoaPPIChangePercentage,
      cocoaPPIChangeReferencePercentage,
    ] = await Promise.all([
      // Query 1: Raw Cocoa Annual Averages
      prisma.$queryRaw`
        SELECT EXTRACT(YEAR FROM observation_date) AS Year, 
               ROUND(AVG(price_usd_per_ton)::numeric, 2) AS Price 
        FROM global_cocoa_prices
        WHERE EXTRACT(YEAR FROM observation_date) BETWEEN ${startYear} AND ${endYear}
        GROUP BY EXTRACT(YEAR FROM observation_date)
        ORDER BY EXTRACT(YEAR FROM observation_date);
      `,

      // Query 2: Cocoa Price change
      prisma.$queryRaw`
        SELECT year, avg_value,
               ROUND(COALESCE(avg_value - LAG(avg_value) OVER (ORDER BY year), 0)::numeric, 2) AS change
        FROM (
          SELECT EXTRACT(YEAR FROM observation_date) AS year,
                 ROUND(AVG(price_usd_per_ton)::numeric, 2) AS avg_value
          FROM global_cocoa_prices
          WHERE EXTRACT(YEAR FROM observation_date) BETWEEN ${startYear} AND ${endYear}
          GROUP BY EXTRACT(YEAR FROM observation_date)
        ) t
        ORDER BY year;
      `,

      // Query 3: Cocoa Price change percentage
      prisma.$queryRaw`
        SELECT Year,
               ROUND(COALESCE((AVGPRICE - LAG(AVGPRICE) OVER (ORDER BY Year)) * 100.0 / NULLIF(LAG(AVGPRICE) OVER (ORDER BY Year), 0), 0)::numeric, 2) AS PricePercentChange
        FROM (
          SELECT EXTRACT(YEAR FROM observation_date) AS Year,
                 AVG(price_usd_per_ton) AS AVGPRICE
          FROM global_cocoa_prices
          GROUP BY EXTRACT(YEAR FROM observation_date)
        ) AS t
        WHERE Year BETWEEN ${startYear} AND ${endYear}
        ORDER BY Year ASC;
      `,

      // Query 4: Raw Manufacturing PPI Annual Averages
      prisma.$queryRaw`
        SELECT ROUND(AVG(ppi_index)::numeric, 2) AS AVGPPI,
               EXTRACT(YEAR FROM observation_date) AS YEAR
        FROM chocolate_ppi
        WHERE EXTRACT(YEAR FROM observation_date) BETWEEN ${startYear} AND ${endYear}
        GROUP BY YEAR
        ORDER BY YEAR ASC;
      `,

      // Query 5: PPI Average Change
      prisma.$queryRaw`
        SELECT Year,
               ROUND(COALESCE(AVGPPI - LAG(AVGPPI) OVER (ORDER BY Year), 0)::numeric, 2) AS PPICHANGE
        FROM (
          SELECT EXTRACT(YEAR FROM observation_date) AS Year,
                 AVG(ppi_index) AS AVGPPI
          FROM chocolate_ppi
          WHERE EXTRACT(YEAR FROM observation_date) BETWEEN ${startYear} AND ${endYear}
          GROUP BY EXTRACT(YEAR FROM observation_date)
        ) AS t
        ORDER BY Year;
      `,

      // Query 6: PPI Average Change Percentage
      prisma.$queryRaw`
        SELECT Year,
               ROUND(COALESCE((AVGPPI - LAG(AVGPPI) OVER (ORDER BY Year)) * 100.0 / NULLIF(LAG(AVGPPI) OVER (ORDER BY Year), 0), 0)::numeric, 2) AS PPICHANGE
        FROM (
          SELECT EXTRACT(YEAR FROM observation_date) AS Year,
                 AVG(ppi_index) AS AVGPPI
          FROM chocolate_ppi
          WHERE EXTRACT(YEAR FROM observation_date) BETWEEN ${startYear} AND ${endYear}
          GROUP BY EXTRACT(YEAR FROM observation_date)
        ) AS t
        ORDER BY Year;
      `,

      // Query 7: Cumulative Inflation relative to 2011 Baseline
      prisma.$queryRaw`
        SELECT year,
               ROUND(((ppi - (
                 SELECT AVG(ppi_index) FROM chocolate_ppi WHERE EXTRACT(YEAR FROM observation_date) = 2011
               )) * 100.0 / (
                 SELECT AVG(ppi_index) FROM chocolate_ppi WHERE EXTRACT(YEAR FROM observation_date) = 2011
               ))::numeric, 2) AS ppi_difference_percentage
        FROM (
          SELECT EXTRACT(YEAR FROM observation_date) AS year,
                 AVG(ppi_index) AS ppi
          FROM chocolate_ppi
          WHERE EXTRACT(YEAR FROM observation_date) BETWEEN ${startYear} AND ${endYear}
          GROUP BY EXTRACT(YEAR FROM observation_date)
        ) AS T
        ORDER BY year ASC;
      `,
    ]);

    //PROMISE.ALL REDUCE THE RESPONSE TIME COMPARED TO MANY REQUESTS

    //  Dispatch unified concurrent collection response
    return res.status(200).json({
      cocoaPrice,
      cocoaPriceChange,
      cocoaPriceChangePercentage,
      cocoaPPI,
      cocoaPPIChange,
      cocoaPPIChangePercentage,
      cocoaPPIChangeReferencePercentage,
    });
  } catch (err) {
    console.error("🔥 Analytics Pipeline Failure:", err.message);
    return res.status(500).json({
      error: "Internal Database Execution Error",
      details: err.message,
    });
  }
};
