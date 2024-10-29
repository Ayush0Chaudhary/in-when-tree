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
import { Separator } from "@/components/ui/separator";

// Sample initial data for parts
// const allPartsList: Part[] = [
//   {
//     name: "Bolt", description: "A standard bolt", quantity: 100,
//     id: "6"
//   },
//   {
//     name: "Nut", description: "A standard nut", quantity: 150,
//     id: "7"
//   },
// ];

const customersList = [
  "John Doe",
  "Jane Smith",
  "Michael Johnson",
  "Emily Davis",
  "Sarah Brown",
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Initially empty order list
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [machine, setMachine] = useState<string>(""); 
  const [grade, setGrade] = useState<string>("");     
  const [cavity, setCavity] = useState<number>(0);    
  const [castingWt, setCastingWt] = useState<number>(0); 

  const handleAddOrder = () => {
    // if (!selectedPart || quantity <= 0) {
    //   alert("Please select a part and enter a valid quantity.");
    //   return;
    // }

    const newOrder: Order = {
      id: Math.random().toString(),
      //part: selectedPart,
      quantity: quantity,
      customer: selectedCustomer,
      machine,
      grade,
      cavity,
      castingWt,
    };

    setOrders([...orders, newOrder]);
    setIsDialogOpen(false);
    //setSelectedPart(null);
    setQuantity(0);
    setMachine(""); // Reset new state
    setGrade("");   // Reset new state
    setCavity(0);   // Reset new state
    setCastingWt(0); // Reset new state
  };

  return (
    <div className="bg-black min-h-screen p-8 w-screen">
      <div className="container mx-auto">
        <Separator />
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
              {/* Searchable dropdown for parts */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Part
                </label>
                <select
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  value={selectedPart ? selectedPart.name : ""}
                  onChange={(e) =>
                    setSelectedPart(
                      allPartsList.find((part) => part.id === e.target.value) ||
                        null
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
              </div> */}

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
            <th className="py-2 px-4 border-b">Part</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Machine</th>  {/* New Column */}
            <th className="py-2 px-4 border-b">Grade</th>    {/* New Column */}
            <th className="py-2 px-4 border-b">Cavity</th>   {/* New Column */}
            <th className="py-2 px-4 border-b">Casting Weight</th> {/* New Column */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{order.customer}</td>
              {/* <td className="py-2 px-4 border-b">{order.part.name}</td> */}
              <td className="py-2 px-4 border-b">{order.quantity}</td>   
              <td className="py-2 px-4 border-b">{order.machine}</td>   
              <td className="py-2 px-4 border-b">{order.grade}</td>   
              <td className="py-2 px-4 border-b">{order.cavity}</td>
              <td className="py-2 px-4 border-b">{order.castingWt}</td>                 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
