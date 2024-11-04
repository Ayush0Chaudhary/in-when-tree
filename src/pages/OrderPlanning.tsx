import { Order, Part } from "@/lib/models";
import React, { useState, useEffect } from "react";

const NextFiveWeeksPlanning: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partQuantities, setPartQuantities] = useState<{
    [key: number]: number;
  }>({});
  const [parts, setParts] = useState<Part[]>([]);
  const [planGrid, setPlanGrid] = useState<{ [key: string]: number }[]>([]);

  useEffect(() => {
    console.log("Plan grid:", planGrid);
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
    if (orders.length > 0) {
      generatePlanGrid();
    }
  }, [orders]);

  useEffect(() => {
    if (parts.length > 0) {
      generateInitialPartQuantities();
    }
  }, [parts]);

  const generatePlanGrid = () => {
    const grid: { [key: string]: number }[] = [];

    for (let i = 0; i < 5; i++) {
      const week: { [key: string]: number } = {};
      orders.forEach((order) => {
        // Initialize the first week with the entire quantity
        week[`${order.id}-week${i + 1}`] = i === 0 ? order.quantity : 0;
      });
      grid.push(week);
    }

    setPlanGrid(grid);
  };

  const generateInitialPartQuantities = () => {
    console.log("PARTS -> ", parts);
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
    // const oldValue = updatedGrid[weekIndex][gridKey];
    updatedGrid[weekIndex][gridKey] = quantity;
    setPlanGrid(updatedGrid);

    // Reset part quantities
    const partQuants = { ...partQuantities };
    orders[orderIndex].component.parts.forEach((part, partIndex) => {
      const partRequirement =
        quantity * orders[orderIndex].component.quantity[partIndex];
      partQuants[part.id] -= partRequirement;
    });

    setPartQuantities(partQuants);

    // Re-check feasibility after updates
    checkCellFeasibility(weekIndex, orders[orderIndex]);
    checkWeekFeasibility(weekIndex);
  };

  const checkWeekFeasibility = (weekIndex: number): boolean => {
    orders.forEach((order) => {
      console.log("WEEK  -> ", partQuantities);
      const gridKey = `${order.id}-week${weekIndex + 1}`;
      const weeklyQuantity = planGrid[weekIndex]?.[gridKey] ?? 0;

      order.component.parts.forEach((part, partIndex) => {
        const partRequirement =
          weeklyQuantity * order.component.quantity[partIndex];

        if (!partQuantities[part.id]) {
          partQuantities[part.id] = 0;
        }
        partQuantities[part.id] += partRequirement;
      });
    });

    return orders.every((order) =>
      order.component.parts.every(
        (part) => partQuantities[part.id] <= part.totalQuantity
      )
    );
  };

  const checkCellFeasibility = (weekIndex: number, order: Order): boolean => {
    console.log(partQuantities);

    const gridKey = `${order.id}-week${weekIndex + 1}`;
    const weeklyQuantity = planGrid[weekIndex]?.[gridKey] ?? 0;

    var answer: boolean = true;

    order.component.parts.forEach((part, partIndex) => {
      const partRequirement =
        weeklyQuantity * order.component.quantity[partIndex];

      if (!partQuantities[part.id]) {
        partQuantities[part.id] = 0;
      }
      if (partQuantities[part.id] + partRequirement > part.totalQuantity) {
        answer = false;
      }
    });
    return answer;
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
              {Array.from({ length: 5 }, (_, weekIndex) => (
                <td
                  key={`${order.id}-week${weekIndex + 1}`}
                  className={`py-2 px-4 border-b ${
                    checkCellFeasibility(weekIndex, order)
                      ? "bg-green-200"
                      : "bg-red-200"
                  }`}
                >
                  <input
                    type="number"
                    className="input w-full px-3 py-2 border border-gray-300 rounded bg-transparent text-black"
                    value={
                      planGrid[weekIndex]?.[
                        `${order.id}-week${weekIndex + 1}`
                      ] ?? 0 // Default to 0 if value is undefined
                    }
                    onChange={(e) =>
                      handleUpdateQuantity(
                        orderIndex,
                        weekIndex,
                        Number(e.target.value)
                      )
                    }
                    disabled={
                      weekIndex === 0
                        ? false
                        : !checkWeekFeasibility(weekIndex - 1)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NextFiveWeeksPlanning;
