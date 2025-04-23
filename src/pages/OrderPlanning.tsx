import { Order, Part } from "@/lib/models";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ForecastRow {
  Month: string;
  Year: string;
  PartNo: string;
  Description: string;
  Quantity: string;
  "Sales Price": string;
  [key: string]: string; // For any other columns
}

interface MonthlyData {
  [key: string]: number;
}

interface PartData {
  partNumber: string;
  description: string;
  totalDemand: number;
  monthlyData: MonthlyData[];
}

const PartDemandForecast: React.FC = () => {
  const [forecastData, setForecastData] = useState<ForecastRow[]>([]);
  const [topParts, setTopParts] = useState<PartData[]>([]);
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");
  const [selectedChart, setSelectedChart] = useState<"line" | "bar">("line");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the CSV from the public folder
    fetch("/forecast_data.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status}`);
        }
        return response.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse<ForecastRow>(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsed.data && parsed.data.length > 0) {
          setForecastData(parsed.data);
          processTopParts(parsed.data);
        } else {
          console.error("No data found in CSV");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading forecast data:", error);
        setIsLoading(false);
      });
  }, []);

  const processTopParts = (data: ForecastRow[]) => {
    // Group by part and calculate total demand for each part
    const partTotals: Record<string, PartData> = {};

    data.forEach((row) => {
      const partNumber = row.PartNo;
      const quantity = parseInt(row.Quantity || "0", 10);

      if (!partTotals[partNumber]) {
        partTotals[partNumber] = {
          partNumber: partNumber,
          description: row.Description,
          totalDemand: 0,
          monthlyData: [],
        };
      }

      // Based on your CSV structure, we'll distribute quantity across months
      // This is a simplified approach since your CSV doesn't have month1, month2 columns
      const monthsData: MonthlyData = {};
      const monthIndex = parseInt(row.Month || "1", 10);

      // Create monthly data - distribute quantity equally across 12 months
      // Adjust this logic based on your actual forecasting needs
      for (let i = 1; i <= 12; i++) {
        const monthKey = `month${i}`;
        // Put the quantity in the correct month, 0 in others
        monthsData[monthKey] = i === monthIndex ? quantity : 0;

        // Add to total demand if this is the correct month
        if (i === monthIndex) {
          partTotals[partNumber].totalDemand += quantity;
        }
      }

      partTotals[partNumber].monthlyData.push(monthsData);
    });

    // Convert to array and sort by total demand
    const sortedParts = Object.values(partTotals)
      .sort((a, b) => b.totalDemand - a.totalDemand)
      .slice(0, 15); // Get top 15

    setTopParts(sortedParts);
  };

  const prepareChartData = (part: PartData) => {
    const chartData = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 1; i <= 12; i++) {
      let totalForMonth = 0;
      part.monthlyData.forEach((monthData) => {
        totalForMonth += monthData[`month${i}`] || 0;
      });

      chartData.push({
        name: months[i - 1],
        demand: totalForMonth,
      });
    }

    return chartData;
  };

  const renderChart = (part: PartData) => {
    const data = prepareChartData(part);

    if (selectedChart === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="demand" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  const renderTable = (part: PartData) => {
    const data = prepareChartData(part);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="py-2 px-3 border-b">Month</th>
              <th className="py-2 px-3 border-b">Forecasted Demand</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-3 border-b">{item.name}</td>
                <td className="py-2 px-3 border-b">{item.demand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Top 15 Parts - 12 Month Demand Forecast
        </h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <span>View:</span>
            <select
              className="border p-2 rounded"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as "graph" | "table")}
            >
              <option value="graph">Graph</option>
              <option value="table">Table</option>
            </select>
          </div>
          {viewMode === "graph" && (
            <div className="flex items-center space-x-2">
              <span>Chart Type:</span>
              <select
                className="border p-2 rounded"
                value={selectedChart}
                onChange={(e) =>
                  setSelectedChart(e.target.value as "line" | "bar")
                }
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Loading forecast data...</div>
      ) : topParts.length === 0 ? (
        <div className="text-center p-8">No forecast data available</div>
      ) : (
        <div className="space-y-8">
          {topParts.map((part, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                {part.description} (Part #: {part.partNumber})
              </h3>
              <p className="text-gray-600 mb-4">
                Total forecasted demand:{" "}
                <span className="font-bold">{part.totalDemand}</span> units
              </p>

              {viewMode === "graph" ? renderChart(part) : renderTable(part)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const NextFiveWeeksPlanning: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partQuantities, setPartQuantities] = useState<{
    [key: number]: number;
  }>({});
  const [parts, setParts] = useState<Part[]>([]);
  const [planGrid, setPlanGrid] = useState<{ [key: string]: number }[]>([]);
  const [feasibilityGrid, setFeasibilityGrid] = useState<any[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error("Error parsing stored orders:", error);
      }
    }
    const storedParts = localStorage.getItem("parts");
    if (storedParts) {
      try {
        setParts(JSON.parse(storedParts));
      } catch (error) {
        console.error("Error parsing stored parts:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) generatePlanGrid();
  }, [orders]);

  useEffect(() => {
    if (parts.length > 0) generateInitialPartQuantities();
  }, [parts]);

  useEffect(() => {
    if (orders.length > 0 && parts.length > 0) {
      checkCellFeasibility();
    }
  }, [orders, parts, planGrid]);

  const generatePlanGrid = () => {
    const grid: { [key: string]: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const week: { [key: string]: number } = {};
      orders.forEach((order) => {
        week[`${order.id}-week${i + 1}`] = 0;
      });
      grid.push(week);
    }
    setPlanGrid(grid);
  };

  const generateInitialPartQuantities = () => {
    const quantities: { [key: number]: number } = {};
    parts.forEach((part) => {
      quantities[part.id] = part.totalQuantity;
    });
    setPartQuantities(quantities);
  };

  const handleUpdateQuantity = (
    orderIndex: number,
    weekIndex: number,
    quantity: number
  ) => {
    const updatedGrid = [...planGrid];
    const gridKey = `${orders[orderIndex].id}-week${weekIndex + 1}`;
    const oldValue = updatedGrid[weekIndex][gridKey] || 0;
    updatedGrid[weekIndex][gridKey] = quantity;

    // const updatedQuantities = { ...partQuantities };
    // orders[orderIndex].component.parts.forEach((part, partIndex) => {
    //   const partUsage =
    //     (quantity - oldValue) *
    //     orders[orderIndex].component.quantity[partIndex];
    //   updatedQuantities[part.id] -= partUsage;
    // });

    setPlanGrid(updatedGrid);
    // setPartQuantities(updatedQuantities);
  };

  const checkCellFeasibility = () => {
    console.log("partQuantities", partQuantities);

    const feasibleGrid = orders.map((order, orderindex) => {
      let remainingQuantity = order.quantity;

      return Array.from({ length: 5 }, (_, weekIndex) => {
        let previousOrdersPartRequired: { [key: number]: number } = {};

        parts.forEach((part) => {
          previousOrdersPartRequired[part.id] = 0;
        });

        for (let i = 0; i < orderindex; i++) {
          const previousOrder = orders[i];
          previousOrder.component.parts.forEach((part, partIndex) => {
            previousOrdersPartRequired[part.id] +=
              previousOrder.component.quantity[partIndex] *
              (planGrid[weekIndex]?.[
                `${previousOrder.id}-week${weekIndex + 1}`
              ] || 0);
          });
        }

        for (let i = 0; i < weekIndex; i++) {
          orders.forEach((order) => {
            order.component.parts.forEach((part, partIndex) => {
              previousOrdersPartRequired[part.id] +=
                order.component.quantity[partIndex] *
                (planGrid[i]?.[`${order.id}-week${i + 1}`] || 0);
            });
          });
        }

        console.log(
          `previousOrdersPartRequired ${orderindex} , ${weekIndex}-> `,
          previousOrdersPartRequired
        );

        const gridKey = `${order.id}-week${weekIndex + 1}`;
        const weekQuantity = planGrid[weekIndex]?.[gridKey] || 0;
        remainingQuantity -= weekQuantity;

        const isFeasible = order.component.parts.every((part, partIndex) => {
          const prevOrdersRequired = previousOrdersPartRequired[part.id] || 0;

          console.log(prevOrdersRequired);
          const required =
            weekQuantity * order.component.quantity[partIndex] +
            prevOrdersRequired;

          return partQuantities[part.id] >= required;
        });

        return {
          editable:
            weekIndex === 0 ? true : remainingQuantity >= 0 && isFeasible,
          color: remainingQuantity >= 0 && isFeasible ? "green" : "red",
          maxQuantity: weekIndex === 0 ? order.quantity : remainingQuantity,
        };
      });
    });
    setFeasibilityGrid(feasibleGrid);
  };

  const renderCell = (order: Order, orderIndex: number, weekIndex: number) => {
    const gridKey = `${order.id}-week${weekIndex + 1}`;
    const feasibility = feasibilityGrid[orderIndex]?.[weekIndex] || {
      editable: false,
      maxQuantity: 0,
    };
    return (
      <td
        key={gridKey}
        className={`py-2 px-4 border-b ${
          feasibility.color === "green" ? "bg-green-200" : "bg-red-200"
        }`}
      >
        <input
          type="number"
          className="input w-full px-3 py-2 border border-gray-300 rounded bg-transparent text-black"
          value={planGrid[weekIndex]?.[gridKey] ?? 0}
          onChange={(e) =>
            handleUpdateQuantity(orderIndex, weekIndex, Number(e.target.value))
          }
          disabled={!feasibility.editable}
          max={feasibility.maxQuantity}
        />
      </td>
    );
  };

  return (
    <div className="bg-white min-h-screen p-8 w-screen">
      <div className="container mx-auto">
        <div className="border-b border-gray-300 py-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Next 5 Weeks Order Planning
          </h1>
        </div>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order</th>
            {Array.from({ length: 5 }, (_, i) => (
              <th key={i} className="py-2 px-4 border-b">
                Week {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, orderIndex) => (
            <tr key={order.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {order.component.name} - {order.quantity}
              </td>
              {Array.from({ length: 5 }).map((_, weekIndex) =>
                renderCell(order, orderIndex, weekIndex)
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <PartDemandForecast />
    </div>
  );
};

export default NextFiveWeeksPlanning;
