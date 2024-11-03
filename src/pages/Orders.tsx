// src/pages/Orders.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../components/ui/button";
import { Comp, Order } from "../lib/models"; // Assuming Order and Part are types in models
import { Separator } from "@/components/ui/separator";

const customersList = [
  "John Doe",
  "Jane Smith",
  "Michael Johnson",
  "Emily Davis",
  "Sarah Brown",
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedComp, setSelectedComp] = useState<Comp | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [machine, setMachine] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [cavity, setCavity] = useState<number>(0);
  const [castingWt, setCastingWt] = useState<number>(0);

  const [components, setComponents] = useState<Comp[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error("Error parsing stored orders:", error);
        setOrders([]);
      }
    }

    const storedComponents = localStorage.getItem("components");
    if (storedComponents) {
      try {
        setComponents(JSON.parse(storedComponents));
      } catch (error) {
        console.error("Error parsing stored components:", error);
        setComponents([]);
      }
    }
  }, []);

  const handleAddOrder = () => {
    if (!selectedComp || quantity <= 0) {
      alert("Please select a component and enter a valid quantity.");
      return;
    }

    var feasibility: boolean = true;
    // Check if the quantity is feasible
    selectedComp.parts.forEach((part, index) => {
      if (part.totalQuantity < quantity * selectedComp.quantity[index]) {
        feasibility = false;
      }
    });

    const newOrder: Order = {
      id: Math.random(),
      component: selectedComp,
      quantity: quantity,
      customer: selectedCustomer,
      machine: machine,
      grade: grade,
      cavity: cavity,
      description: selectedComp.description,
      status: feasibility ? "Feasible" : "Not feasible",
      cast_wtg: castingWt,
    };

    // store in local db
    const updatedOrders = [...orders, newOrder];
    try {
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error storing orders in local storage:", error);
      alert("Error storing order. Please try again.");
    }

    setIsDialogOpen(false);
    setQuantity(0);
    setMachine(""); // Reset new state
    setGrade(""); // Reset new state
    setCavity(0); // Reset new state
    setCastingWt(0); // Reset new state
  };

  return (
    <div className="bg-white min-h-screen p-8 w-screen">
      <div className="container mx-auto">
        <Separator />
      </div>
      <h1 className="text-2xl font-bold text-black mb-4">Orders</h1>
      <div className="mb-4 flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Add Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Order</DialogTitle>
              <DialogDescription>
                Select the part and enter quantity.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer
                </label>
                <select
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  value={selectedCustomer || ""}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="" disabled>
                    Select a customer...
                  </option>
                  {customersList.map((customer, index) => (
                    <option key={index} value={customer}>
                      {customer}
                    </option>
                  ))}
                </select>
              </div>
              {/* Dropdown for Component Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Component
                </label>
                <select
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  value={selectedComp ? selectedComp.id : ""}
                  onChange={(e) =>
                    setSelectedComp(
                      components.find(
                        (component) => component.id === Number(e.target.value)
                      ) || null
                    )
                  }
                >
                  <option value="" disabled>
                    Select a component...
                  </option>
                  {components.map((component, index) => (
                    <option key={index} value={component.id}>
                      {component.name} - {component.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input for quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Enter quantity"
                />
              </div>
              {/* Input for machine */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Machine
                </label>
                <input
                  type="text"
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  value={machine}
                  onChange={(e) => setMachine(e.target.value)}
                  placeholder="Enter machine name"
                />
              </div>

              {/* Input for grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grade
                </label>
                <input
                  type="text"
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Enter grade"
                />
              </div>

              {/* Input for cavity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cavity
                </label>
                <input
                  type="number"
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  value={cavity}
                  onChange={(e) => setCavity(Number(e.target.value))}
                  placeholder="Enter cavity count"
                />
              </div>

              {/* Input for casting weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Casting Weight
                </label>
                <input
                  type="number"
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  value={castingWt}
                  onChange={(e) => setCastingWt(Number(e.target.value))}
                  placeholder="Enter casting weight"
                  step="0.01" // Allow for decimal input
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="default" type="submit" onClick={handleAddOrder}>
                Save Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders list */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Customer</th>
            <th className="py-2 px-4 border-b">Component</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Machine</th> {/* New Column */}
            <th className="py-2 px-4 border-b">Grade</th> {/* New Column */}
            <th className="py-2 px-4 border-b">Cavity</th> {/* New Column */}
            <th className="py-2 px-4 border-b">Casting Weight</th>{" "}
            <th className="py-2 px-4 border-b">Status</th>{" "}
            <th className="py-2 px-4 border-b">Actions</th>
            {/* New Column */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{order.customer}</td>
              <td className="py-2 px-4 border-b">{order.component.name}</td>
              <td className="py-2 px-4 border-b">{order.quantity}</td>
              <td className="py-2 px-4 border-b">{order.machine}</td>
              <td className="py-2 px-4 border-b">{order.grade}</td>
              <td className="py-2 px-4 border-b">{order.cavity}</td>
              <td className="py-2 px-4 border-b">{order.cast_wtg}</td>
              <td className="py-2 px-4 border-b">{order.status}</td>
              <td className="py-2 px-4 border-b">
                {order.status === "Feasible" && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                    onClick={() => {
                      const updatedOrders = [...orders];
                      updatedOrders[index] = { ...order, status: "Complete" };
                      setOrders(updatedOrders);
                    }}
                  >
                    Mark as Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
