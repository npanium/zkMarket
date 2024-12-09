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
import { useToast } from "@/hooks/use-toast";

export function CreateListingForm() {
  const router = useRouter();
  const { toast } = useToast();
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
      const response = await fetch("/api/create-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, range, type }),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      const data = await response.json();
      toast({
        title: "Success!",
        description: "Listing created successfully",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
