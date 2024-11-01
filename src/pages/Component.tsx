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
import { Comp, Part } from "../lib/models";
import { baseUrl } from "@/lib/consts";
import axios from "axios";

const Components: React.FC = () => {
  const [components, setComponents] = useState<Comp[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComponent, setNewComponent] = useState<Comp>({
    id: Math.random(),
    name: "",
    quantity: [],
    description: "",
    parts: [],
  });
  const [selectedPartId, setSelectedPartId] = useState<number>(0);
  const [selectedPartQuantity, setSelectedPartQuantity] = useState<number>(0);

  const [partsLoading, setPartsLoading] = useState(false);
  const [partsError, setPartsError] = useState<string | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/components`);
      console.log("RESPONSE DATA -> ", response.data);
      setComponents(response.data);
      setLoading(false);
      console.log("COMPONENTS -> ", components);
    } catch (error) {
      console.log(error);
      console.error("Error fetching components:", error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewComponent({
      id: Math.random(),
      name: "",
      quantity: [],
      description: "",
      parts: [],
    });
    setSelectedPartId(0);
    setSelectedPartQuantity(0);
  };

  const fetchParts = async () => {
    setPartsLoading(true);
    setPartsError(null);

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
        setPartsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching parts:", error);
        setPartsError("Error fetching the parts. Try again.");
        setPartsLoading(false);
      })
      .finally(() => {
        setPartsLoading(false);
      });
  };

  const handleOpenDialog = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) fetchParts();
    else resetForm();
  };

  const handleAddComponent = () => {
    if (newComponent.name.trim() === "") {
      alert("Component name is required");
      return;
    }
    setComponents([...components, newComponent]);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleAddPartToComponent = () => {
    console.log("Selected part:", selectedPartId, selectedPartQuantity);
    console.log("All Parts:", parts);
    const selectedPart = parts.find((part) => part.id === selectedPartId);
    if (!selectedPart) {
      alert("Please select a part from the list");
      return;
    }
    if (selectedPartQuantity <= 0) {
      alert("Please select a valid quantity for the part");
      return;
    }
    if (newComponent.parts.some((part) => part.id === selectedPart.id)) {
      alert("This part is already added to the component");
      return;
    }
    const partWithQuantity = {
      ...selectedPart,
      quantity: selectedPartQuantity,
    };
    setNewComponent((prevComponent) => ({
      ...prevComponent,
      parts: [...prevComponent.parts, partWithQuantity],
    }));
    setSelectedPartId(0);
    setSelectedPartQuantity(0);
  };

  if (loading) return <p className="bg-white">Loading Components...</p>;

  return (
    <div className="bg-black min-h-screen p-8 w-full">
      <div className="container mx-auto">
        <Separator />
      </div>
      <h1 className="text-2xl font-bold mb-4 text-white">
        Components Inventory
      </h1>
      <div className="mb-4 flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={handleOpenDialog}>
          <DialogTrigger asChild>
            <Button variant="default">Add Component</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Component</DialogTitle>
              <DialogDescription>
                Enter the details for the new component and its parts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Component Name
                </label>
                <input
                  type="text"
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  value={newComponent.name}
                  onChange={(e) =>
                    setNewComponent({ ...newComponent, name: e.target.value })
                  }
                  placeholder="Enter component name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
                  value={newComponent.description}
                  onChange={(e) =>
                    setNewComponent({
                      ...newComponent,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter component description"
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium">Add Parts</h3>
                {partsLoading ? (
                  <p>Loading parts...</p>
                ) : partsError ? (
                  <p className="text-red-600">{partsError}</p>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Select Part
                      </label>
                      <select
                        className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
                        value={selectedPartId}
                        onChange={(e) =>
                          setSelectedPartId(Number(e.target.value))
                        }
                      >
                        <option value="" disabled>
                          Select a part...
                        </option>
                        {parts.map((part) => (
                          <option key={part.id} value={part.id}>
                            {part.name} - {part.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
                        value={selectedPartQuantity}
                        onChange={(e) =>
                          setSelectedPartQuantity(Number(e.target.value))
                        }
                        placeholder="Enter quantity"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      onClick={handleAddPartToComponent}
                      disabled={!selectedPartId}
                    >
                      Add Selected Part
                    </Button>
                  </div>
                )}
                <ul className="mt-4">
                  {newComponent.parts.map((part, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {part.name} - {part.description} (Qty: {part.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <DialogClose asChild>
                <Button
                  variant="default"
                  type="submit"
                  onClick={handleAddComponent}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Component
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Render table with components */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Parts</th>
          </tr>
        </thead>
        <tbody>
          {components.map((component, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{component.name}</td>
              <td className="py-2 px-4 border-b">{component.description}</td>
              <td className="py-2 px-4 border-b">{component.quantity}</td>
              <td className="py-2 px-4 border-b">
                {component.parts.map((part, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {part.name} - {part.description} (Qty: {part.quantity})
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Table rendering omitted for brevity */}
    </div>
  );
};

export default Components;
