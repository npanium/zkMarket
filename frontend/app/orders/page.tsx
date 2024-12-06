"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersList } from "@/components/orders-list";
import { useState } from "react";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("active");

  // Mock data
  const activeOrders = [
    {
      id: 1,
      range: "LOW",
      type: "SELL",
      timestamp: Date.now(),
      status: "pending",
      actualPrice: 300,
    },
    {
      id: 2,
      range: "MID",
      type: "BUY",
      timestamp: Date.now() - 3600000,
      status: "matching",
      actualPrice: 1200,
    },
  ];

  const pastOrders = [
    {
      id: 3,
      range: "HIGH",
      type: "SELL",
      timestamp: Date.now() - 86400000,
      status: "completed",
      actualPrice: 3000,
      matchedPrice: 3000,
    },
    {
      id: 4,
      range: "MID",
      type: "BUY",
      timestamp: Date.now() - 172800000,
      status: "completed",
      actualPrice: 800,
      matchedPrice: 750,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <OrdersList orders={activeOrders} type="active" />
        </TabsContent>

        <TabsContent value="past">
          <OrdersList orders={pastOrders} type="past" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
