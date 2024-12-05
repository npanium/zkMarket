"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

export function CreateListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const ranges = {
    LOW: "100-500",
    MID: "400-1500",
    HIGH: "1000-5000",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would:
      // 1. Generate ZK proof for price in range
      // 2. Submit to smart contract
      // 3. Wait for confirmation

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      router.push("/");
    } catch (error) {
      console.error("Error creating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="SELL">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price Range
            </label>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ranges).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {key} ({value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Actual Price (Hidden)
            </label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter actual price"
              min="0"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !range || !price || !type}
          >
            {loading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
