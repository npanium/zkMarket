import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Order {
  id: number;
  range: string;
  type: string;
  timestamp: number;
  status: string;
  actualPrice: number;
  matchedPrice?: number;
}

interface OrdersListProps {
  orders: Order[];
  type: "active" | "past";
}

export function OrdersList({ orders, type }: OrdersListProps) {
  const ranges = {
    LOW: "100-500",
    MID: "400-1500",
    HIGH: "1000-5000",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "matching":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No {type} orders found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="font-bold">
              {order.type} Order #{order.id}
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-2">
            <p>
              Range: {order.range} ({ranges[order.range as keyof typeof ranges]}
              )
            </p>
            <p>Your Price: {order.actualPrice}</p>
            {order.matchedPrice && <p>Matched Price: {order.matchedPrice}</p>}
            <p className="text-sm text-gray-500">
              Created: {new Date(order.timestamp).toLocaleString()}
            </p>
          </CardContent>

          {type === "active" && (
            <CardFooter>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => console.log(`Cancelling order ${order.id}`)}
              >
                Cancel Order
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
