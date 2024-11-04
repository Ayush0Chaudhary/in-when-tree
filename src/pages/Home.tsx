// src/pages/Orders.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Orders from "./Orders";
import Components from "./Component";
import Parts from "./Parts";
import OrderPlanning from "./OrderPlanning";

const Home: React.FC = () => {
  return (
    <div className="bg-white min-h-screen w-screen">
      <Tabs defaultValue="parts" className="w-screen">
        <TabsList className="flex space-x-4">
          <TabsTrigger
            value="parts"
            className="bg-white hover:bg-gray-200 data-[state=active]:bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Parts
          </TabsTrigger>
          <TabsTrigger
            value="components"
            className="bg-white hover:bg-gray-200 data-[state=active]:bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Components
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="bg-white hover:bg-gray-200 data-[state=active]:bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="plan"
            className="bg-white hover:bg-gray-200 data-[state=active]:bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Plan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="parts">
          <Parts></Parts>
        </TabsContent>
        <TabsContent value="components">
          <Components></Components>
        </TabsContent>
        <TabsContent value="orders">
          <Orders></Orders>
        </TabsContent>
        <TabsContent value="plan">
          <OrderPlanning></OrderPlanning>
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
