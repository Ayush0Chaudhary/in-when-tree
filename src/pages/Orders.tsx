// src/pages/Orders.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../components/ui/button";
import { Part, Order } from "../lib/models"; // Assuming Order and Part are types in models
import Navbar from "@/components/nav";

// Sample initial data for parts
const allPartsList: Part[] = [
  {
    id: Math.random().toString(),
    name: "Bolt",
    description: "A standard bolt",
    quantity: 100,
  },
  {
    id: Math.random().toString(),
    name: "Nut",
    description: "A standard nut",
    quantity: 150,
  },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Initially empty order list
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const handleAddOrder = () => {
    if (!selectedPart || quantity <= 0) {
      alert("Please select a part and enter a valid quantity.");
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(),
      part: selectedPart,
      quantity,
    };

    setOrders([...orders, newOrder]);
    setIsDialogOpen(false);
    setSelectedPart(null);
    setQuantity(0);
  };

  return (
    <div className="bg-black min-h-screen p-8 w-screen">
      <div className="container mx-auto">
        <Navbar />
      </div>
      <h1 className="text-2xl font-bold text-white mb-4">Orders</h1>
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
                  Part
                </label>
                <select
                  className="input w-full px-3 py-2 border border-gray-300 rounded"
                  value={selectedPart ? selectedPart.name : ""}
                  onChange={(e) =>
                    setSelectedPart(
                      allPartsList.find(
                        (part) => part.id === e.target.value
                      ) || null
                    )
                  }
                >
                  <option value="" disabled>
                    Select a part...
                  </option>
                  {allPartsList.map((part, index) => (
                    <option key={index} value={part.name}>
                      {part.name} - {part.description}
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
                  className="input w-full px-3 py-2 border border-gray-300 rounded"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Enter quantity"
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
            <th className="py-2 px-4 border-b">Part</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{order.part.name}</td>
              <td className="py-2 px-4 border-b">{order.part.description}</td>
              <td className="py-2 px-4 border-b">{order.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
