import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Part } from "../lib/models";

const Parts: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedParts = localStorage.getItem("parts");
    if (storedParts) {
      try {
        setParts(JSON.parse(storedParts));
      } catch (error) {
        console.error("Error parsing stored parts:", error);
        setParts([]);
      }
    }
    setLoading(false);
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPart, setNewPart] = useState<Part>({
    id: Math.random(),
    name: "",
    description: "",
    totalQuantity: 0,
  });

  const handleAddPart = () => {
    if (newPart.name.trim() === "") {
      alert("Part name is required");
      return;
    }
    if (newPart.description.trim() === "") {
      alert("Part description is required");
      return;
    }
    if (newPart.totalQuantity <= 0) {
      alert("Part quantity is required");
      return;
    }

    console.log("Adding part: -> ", newPart);

    // Add new part to the state and save it in localStorage
    const updatedParts = [...parts, newPart];
    setParts(updatedParts);
    localStorage.setItem("parts", JSON.stringify(updatedParts));

    setIsDialogOpen(false);
    setNewPart({
      id: Math.random(),
      name: "",
      description: "",
      totalQuantity: 0,
    });
  };

  if (loading) return <p className="bg-white">Loading parts...</p>;

  return (
    <div className="bg-white min-h-screen p-8 w-[100]">
      <div className="container mx-auto">
        <Separator />
      </div>
      <h1 className="text-2xl font-bold mb-4 text-black">Parts Inventory</h1>
      <div className="mb-4 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Add Part</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Part</DialogTitle>
              <DialogDescription>
                Enter the details for the new part.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  value={newPart.name}
                  onChange={(e) =>
                    setNewPart({ ...newPart, name: e.target.value })
                  }
                  placeholder="Enter part name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  value={newPart.description}
                  onChange={(e) =>
                    setNewPart({ ...newPart, description: e.target.value })
                  }
                  placeholder="Enter part description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  value={newPart.totalQuantity}
                  onChange={(e) =>
                    setNewPart({
                      ...newPart,
                      totalQuantity: Number(e.target.value),
                    })
                  }
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <DialogClose asChild>
                <Button variant="default" type="submit" onClick={handleAddPart}>
                  Save Part
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{part.name}</td>
              <td className="py-2 px-4 border-b">{part.description}</td>
              <td className="py-2 px-4 border-b">{part.totalQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Parts;
