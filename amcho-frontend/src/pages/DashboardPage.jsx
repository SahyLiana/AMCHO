import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Chart from "react-apexcharts";
import Navbar from "../components/Navbar";
import TableAnalytic from "../components/TableAnalytic";

//Calling this function to set the intervals between years(start-end)
const dates = (() => {
  const result = [];
  let startYear = 1992;

  while (startYear < 2019) {
    result.push({
      startYear,
      endYear: startYear + 5,
    });

    startYear += 5;
  }

  result.push({
    startYear: 2020,
    endYear: 2026,
  });

  return result;
})();

function DashboardPage() {
  const { user } = useOutletContext();
  //Initializing the default indicator years (both in table and charts)
  const [indicators, setIndicators] = useState([
    2020, 2021, 2022, 2023, 2024, 2025, 2026,
  ]);
  const [dataAnalytics, setDataAnalytics] = useState(null);
  //console.log(indicators);

  //This function will change the year on the select dropdown then dynamically change the UI
  const changeIndicators = ({ startYear, endYear }) => {
    setIndicators(
      [...Array(endYear - startYear + 1).keys()].map((x) => x + startYear),
    );
  };

  //Initializing the line bar chart (mixed)
  const [stateLineBar, setStateLineBar] = useState({
    series: [
      {
        name: "Cocoa Price",
        type: "column",
        data: [],
      },
      {
        name: "PPI Variation by Year",
        type: "line",
        data: [],
      },
    ],

    options: {
      theme: {
        mode: "dark", // This changes the overall theme
        palette: "palette1",
        monochrome: {
          enabled: false,
        },
      },

      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
        colors: ["#f59e0b"],
      },
      title: {
        text: "Cocoa Price/PPI Variation by Year",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      xaxis: {
        type: "category", // --- ADDED HERE: Tell it to expect { x, y } data shapes ---
      },
      yaxis: [
        {
          title: {
            text: "Cocoa Price",
          },
        },
        {
          opposite: true,
          title: {
            text: "PPI Variation by Year",
          },
        },
      ],
    },
  });

  //Initializing the line chart for PPI
  const [lineChartPPI, setlineChartPPI] = useState({
    series: [
      {
        name: "Cocoa Price",
        data: [],
      },
    ],
    options: {
      theme: {
        mode: "dark", // This changes the overall theme
        palette: "palette1",
        monochrome: {
          enabled: false,
        },
      },
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        marker: {
          show: true, // shows the color dot next to the text
        },
        x: {
          show: true, // shows the x-axis value (the month/indicator) at the top
        },
        y: {
          title: {
            formatter: (seriesName) => `${seriesName}:`, // customizes the label
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
        colors: ["#f59e0b"],
      },
      title: {
        text: "PPI variation by Year",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: indicators.map((indicator) => `${indicator}`),
      },
    },
  });

  //Initializing the line chart for cocoa price
  const [lineChartCocoaPrice, setlineChartCocoaPrice] = useState({
    series: [
      {
        name: "Cocoa Price",
        data: [],
      },
    ],
    options: {
      theme: {
        mode: "dark", // This changes the overall theme
        palette: "palette1",
        monochrome: {
          enabled: false,
        },
      },
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        marker: {
          show: true, // shows the color dot next to the text
        },
        x: {
          show: true, // shows the x-axis value (the month/indicator) at the top
        },
        y: {
          title: {
            formatter: (seriesName) => `${seriesName}:`, // customizes the label
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Cocoa variation by Year",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: indicators.map((indicator) => `${indicator}`),
      },
    },
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        //API Call
        const response = await fetch(
          `http://localhost:5000/api/cocoa?startYear=${indicators[0]}&endYear=${indicators[indicators.length - 1]}`,
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setDataAnalytics(data);
          setlineChartCocoaPrice({
            series: [
              {
                name: "Cocoa Price",
                data: data.cocoaPrice.map((item) => item.price),
              },
            ],
            options: {
              xaxis: {
                categories: indicators.map((indicator) => `${indicator}`),
              },
            },
          });
          setlineChartPPI({
            series: [
              {
                name: "PPI Variation",
                data: data.cocoaPPI.map((item) => item.avgppi),
              },
            ],
            options: {
              xaxis: {
                categories: data.cocoaPPI.map((item) => `${item.year}`),
              },
            },
          });
          const alignedCocoaPrice = indicators.map((year) => {
            const match = data.cocoaPrice.find((item) => item.year === year);
            return match ? match.price : null; // returns null if year doesn't exist
          });

          //  Align the PPI data with the indicator years
          const alignedPPI = indicators.map((year) => {
            const match = data.cocoaPPI.find((item) => item.year === year);
            return match ? match.avgppi : null; // returns null if year doesn't exist (e.g. 2007-2010)
          });
          setStateLineBar((prev) => ({
            series: [
              {
                name: "Cocoa Price",
                type: "column",

                data: alignedCocoaPrice,
              },
              {
                name: "PPI Variation",
                type: "line",

                data: alignedPPI,
              },
            ],
            options: {
              ...prev.options,
              labels: indicators.map((ind) => `${ind}`),
              xaxis: {
                type: "category",
              },
            },
          }));
        }
      } catch (err) {
        console.error("Auth check failed:", err.message);
      }
    };
    fetchAnalytics();
  }, [indicators]);

  return (
    <div className="min-h-screen text-white bg-slate-100 ">
      <Navbar user={user} />
      <main className="max-w-8xl mx-auto p-8">
        <div className="bg-slate-800 border flex gap-2 w-full border-slate-700 rounded-xl p-6">
          <div className="flex-1">
            {" "}
            <h1 className="text-2xl text-amber-500 font-bold mb-2">
              Protected Analytics Environment
            </h1>
            <div className="flex mb-10 mt-4 items-center gap-4  ">
              <p>Select a date range:</p>
              {/* Select dropdown for changing the start and end year */}
              <select
                defaultValue="2020-2026"
                onChange={(e) => {
                  const [startYear, endYear] = e.target.value
                    .split("-")
                    .map(Number);

                  changeIndicators({ startYear, endYear });
                }}
                className="border-slate-200/20 bg-slate-800 text-center max-w-[10rem] w-full text-xs border rounded-md p-1"
              >
                {dates.map((date, index) => (
                  <option
                    key={index}
                    value={`${date.startYear}-${date.endYear}`}
                  >
                    {date.startYear}-{date.endYear}
                  </option>
                ))}
              </select>
            </div>
            <TableAnalytic
              indicators={indicators}
              dataAnalytics={dataAnalytics}
            />
          </div>
          <div className="flex-1 gap-2 bg-slate-800">
            <Chart
              options={lineChartCocoaPrice.options}
              series={lineChartCocoaPrice.series}
              type="line"
              height={250}
            />

            <Chart
              options={lineChartPPI.options}
              series={lineChartPPI.series}
              type="line"
              height={250}
            />

            <Chart
              options={stateLineBar.options}
              series={stateLineBar.series}
              type="line"
              height={250}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
