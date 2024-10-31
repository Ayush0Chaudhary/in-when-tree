import React, { useState } from "react";
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

const initialComponents: Comp[] = [
  {
    id: Math.random().toString(),
    name: "Table",
    description: "A wooden dining table",
    parts: [
      {
        id: Math.random().toString(),
        name: "Leg",
        description: "Wooden leg",
        quantity: 4,
      },
      {
        id: Math.random().toString(),
        name: "Screw",
        description: "Metal screw",
        quantity: 10,
      },
      {
        id: Math.random().toString(),
        name: "Board",
        description: "Wooden board",
        quantity: 1,
      },
    ],
  },
  {
    id: Math.random().toString(),
    name: "Chair",
    description: "A comfortable office chair",
    parts: [
      {
        id: Math.random().toString(),
        name: "Wheel",
        description: "Plastic wheel",
        quantity: 5,
      },
      {
        id: Math.random().toString(),
        name: "Screw",
        description: "Metal screw",
        quantity: 8,
      },
      {
        id: Math.random().toString(),
        name: "Seat",
        description: "Cushioned seat",
        quantity: 1,
      },
    ],
  },
  {
    id: Math.random().toString(),
    name: "Lamp",
    description: "A desk lamp",
    parts: [
      {
        id: Math.random().toString(),
        name: "Bulb",
        description: "LED bulb",
        quantity: 1,
      },
      {
        id: Math.random().toString(),
        name: "Base",
        description: "Metal base",
        quantity: 1,
      },
      {
        id: Math.random().toString(),
        name: "Switch",
        description: "On/Off switch",
        quantity: 1,
      },
    ],
  },
];
const existingParts: Part[] = [
  {
    id: Math.random().toString(),
    name: "Screw",
    description: "Metal screw",
    quantity: 100,
  },
  {
    id: Math.random().toString(),
    name: "Nut",
    description: "Metal nut",
    quantity: 50,
  },
  {
    id: Math.random().toString(),
    name: "Bolt",
    description: "Metal bolt",
    quantity: 75,
  },
];

const Components: React.FC = () => {
  const [components, setComponents] = useState<Comp[]>(initialComponents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComponent, setNewComponent] = useState<Comp>({
    id: Math.random().toString(),
    name: "",
    description: "",
    parts: [],
  });
  const [selectedPartId, setSelectedPartId] = useState<string>("");
  const [selectedPartQuantity, setSelectedPartQuantity] = useState<number>(0);

  const resetForm = () => {
    setNewComponent({
      id: Math.random().toString(),
      name: "",
      description: "",
      parts: [],
    });
    setSelectedPartId("");
    setSelectedPartQuantity(0);
  };

  const handleAddComponent = () => {
    if (newComponent.name.trim() === "") {
      alert("Component name is required");
      return;
    }
    //TODO: check the parts array is not empty

    setComponents([...components, newComponent]);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleAddPartToComponent = () => {
    const selectedPart = existingParts.find(
      (part) => part.id === selectedPartId
    );

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
    setSelectedPartId("");
    setSelectedPartQuantity(0);
  };

  return (
    <div className="bg-black min-h-screen p-8 w-full">
      <div className="container mx-auto">
        <Separator />
      </div>
      <h1 className="text-2xl font-bold mb-4 text-white">
        Components Inventory
      </h1>
      <div className="mb-4 flex justify-end">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
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

            {/* <DialogClose asChild>
              <button
                className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200"
                aria-label="Close"
              >
                &times;
              </button>
            </DialogClose> */}
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
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Select Part
                    </label>
                    <select
                      className="input w-full px-3 py-2 border border-gray-300 rounded bg-white"
                      value={selectedPartId}
                      onChange={(e) => setSelectedPartId(e.target.value)}
                    >
                      <option value="" disabled>
                        Select a part...
                      </option>
                      {existingParts.map((part, index) => (
                        <option key={index} value={part.id}>
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
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Component Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Parts</th>
          </tr>
        </thead>
        <tbody>
          {components.map((component, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{component.name}</td>
              <td className="py-2 px-4 border-b">{component.description}</td>
              <td className="py-2 px-4 border-b">
                <ul>
                  {component.parts.map((part, partIndex) => (
                    <li key={partIndex}>
                      {part.name} - {part.description} (Qty: {part.quantity})
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Components;
