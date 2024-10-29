// src/pages/Orders.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Orders from "./Orders";
import Components from "./Component";
import Parts from "./Parts";

const Home: React.FC = () => {
  return (
    <div className="bg-black min-h-screen w-screen">
      <Tabs defaultValue="parts" className="w-screen">
        <TabsList>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
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
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
