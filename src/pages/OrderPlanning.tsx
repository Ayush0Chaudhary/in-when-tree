import { Order, Part } from "@/lib/models";
import React, { useState, useEffect } from "react";

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
    </div>
  );
};

export default NextFiveWeeksPlanning;
