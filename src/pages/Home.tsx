// src/pages/Orders.tsx
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Inventory from "./Inventory";
import Orders from "./Orders";

const Home: React.FC = () => {
  return (
    <div className="bg-black min-h-screen w-screen">
      <Tabs defaultValue="account" className="w-screen">
        <TabsList>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="parts">
          <Inventory></Inventory>
        </TabsContent>
        <TabsContent value="components">
          <Inventory></Inventory>
        </TabsContent>
        <TabsContent value="orders">
          <Orders></Orders>
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
