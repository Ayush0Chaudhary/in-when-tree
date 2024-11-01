import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../lib/consts";
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

// Sample data (you can replace this with actual API data)

const Parts: React.FC = () => {
  // const [parts, setParts] = useState<Part[]>(initialParts);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseUrl}/parts`)
      .then((response) => {
        console.log("API response:", response.data); // Check the data format
        if (Array.isArray(response.data)) {
          setParts(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setParts([]); // Or handle it differently if necessary
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching parts:", error);
        setLoading(false);
      });
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPart, setNewPart] = useState<Part>({
    id: Math.random(),
    name: "",
    description: "",
    quantity: 0,
  });

  const handleAddPart = () => {
    if (newPart.name.trim() === "") {
      alert("Part name is required");
      return;
    }

    // Send POST request to add new part
    axios
      .post(`${baseUrl}/parts`, {
        name: newPart.name,
        description: newPart.description,
        quantity: newPart.quantity,
      })
      .then((response) => {
        // If the request is successful, add the new part to the state

        setParts([...parts, response.data]);
        setIsDialogOpen(false);
        setNewPart({
          id: Math.random(),
          name: "",
          description: "",
          quantity: 0,
        });
      })
      .catch((error) => {
        console.error("Error adding part:", error);
        console.log("Error adding part:", error);
        alert("Failed to add part. Please try again.");
      });
  };

  if (loading) return <p className="bg-white">Loading parts...</p>;

  return (
    <div className="bg-black min-h-screen p-8 w-[100]">
      <div className="container mx-auto">
        <Separator />
      </div>
      <h1 className="text-2xl font-bold mb-4 text-white">Parts Inventory</h1>
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
                  value={newPart.quantity}
                  onChange={(e) =>
                    setNewPart({ ...newPart, quantity: Number(e.target.value) })
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
              <td className="py-2 px-4 border-b">{part.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Parts;
