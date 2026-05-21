# GETTING COCOA PRICES EACH YEAR USING EXTRACT FUNCTION

SELECT EXTRACT(YEAR FROM observation_date) AS Year, AVG(price_usd_per_ton) AS Price FROM global_cocoa_prices
WHERE EXTRACT(YEAR FROM observation_date) BETWEEN 2020 AND 2026
GROUP BY EXTRACT(YEAR FROM observation_date)
ORDER BY EXTRACT(YEAR FROM observation_date)
LIMIT 20

# GETTING THE COCOA PRICE CHANGE OVER TIME PERIOD

SELECT
year,
avg_value,
ROUND(
COALESCE(
avg_value - LAG(avg_value) OVER (ORDER BY year),
0
),2) AS change
FROM (
SELECT
EXTRACT(YEAR FROM observation_date) AS year,
AVG(price_usd_per_ton) AS avg_value
FROM global_cocoa_prices
WHERE EXTRACT(YEAR FROM observation_date) BETWEEN 2020 AND 2025
GROUP BY EXTRACT(YEAR FROM observation_date)
) t
ORDER BY year LIMIT 100

# GETTING THE COCOA PRICE CHANGE OVER TIME PERIOD IN PERCENTAGE

SELECT Year,
ROUND((COALESCE(AVGPRICE-LAG(AVGPRICE) OVER (ORDER BY(Year)),0)\*100/AVGPRICE),2) AS PricePercentChange
FROM
(SELECT
EXTRACT(YEAR FROM observation_date) AS Year,
AVG(price_usd_per_ton) AS AVGPRICE
FROM global_cocoa_prices
GROUP BY YEAR) AS t
WHERE Year BETWEEN 2020 AND 2026
ORDER BY Year ASC
LIMIT 10

################################################################################################################################

# GETTING THE PPI

SELECT
ROUND(AVG(ppi_index),2) AS AVGPPI,
EXTRACT(YEAR FROM observation_date) AS YEAR
FROM chocolate_ppi
WHERE EXTRACT(YEAR FROM observation_date) BETWEEN 2020 AND 2026
GROUP BY YEAR
LIMIT 100

# GETTING THE PPICHANGE

SELECT
Year,
ROUND(COALESCE(AVGPPI - LAG(AVGPPI) OVER (ORDER BY Year), 0),2) AS PPICHANGE
FROM (
SELECT
EXTRACT(YEAR FROM observation_date) AS Year,
AVG(ppi_index) AS AVGPPI
FROM chocolate_ppi
WHERE EXTRACT(YEAR FROM observation_date) BETWEEN 2020 AND 2026
GROUP BY EXTRACT(YEAR FROM observation_date)
) AS t
ORDER BY Year
LIMIT 100

# GETTING THE PPICHANGE PERCENTAGE

SELECT
Year,
ROUND( COALESCE((AVGPPI - LAG(AVGPPI) OVER (ORDER BY Year)) \* 100/ AVGPPI, 0),2) AS PPICHANGE
FROM (
SELECT
EXTRACT(YEAR FROM observation_date) AS Year,
AVG(ppi_index) AS AVGPPI
FROM chocolate_ppi
WHERE EXTRACT(YEAR FROM observation_date) BETWEEN 2020 AND 2026
GROUP BY EXTRACT(YEAR FROM observation_date)
) AS t
ORDER BY Year
LIMIT 100

# GETTING THE PPI FROM THE INDEX 2011

SELECT
year,
-- Subtracting the dynamic 2011 baseline from the current year's average
(ppi - (
SELECT AVG(ppi_index)
FROM chocolate_ppi
WHERE EXTRACT(YEAR FROM observation_date) = 2011
)) AS ppi_difference
FROM (
SELECT
EXTRACT(YEAR FROM observation_date) AS year,
AVG(ppi_index) AS ppi
FROM chocolate_ppi
WHERE EXTRACT(YEAR FROM observation_date) BETWEEN 2020 AND 2026
GROUP BY EXTRACT(YEAR FROM observation_date)
) AS T
ORDER BY year DESC
LIMIT 100

# GETTING THE PPI% FROM THE INDEX 2011

SELECT
year,
((ppi - (
SELECT AVG(ppi_index)
FROM chocolate_ppi
WHERE EXTRACT(YEAR FROM observation_date) = 2011
)) \* 100.0 / (
SELECT AVG(ppi_index)
FROM chocolate_ppi
WHERE EXTRACT(YEAR FROM observation_date) = 2011
)) AS ppi_difference_percentage
FROM (
SELECT
EXTRACT(YEAR FROM observation_date) AS year,
AVG(ppi_index) AS ppi
FROM chocolate_ppi
WHERE EXTRACT(YEAR FROM observation_date) BETWEEN 2020 AND 2026
GROUP BY EXTRACT(YEAR FROM observation_date)
) AS T
ORDER BY year DESC
LIMIT 100;
