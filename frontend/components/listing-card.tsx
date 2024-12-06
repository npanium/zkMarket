import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface ListingCardProps {
  listing: {
    id: number;
    range: string;
    type: string;
    timestamp: number;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const ranges = {
    LOW: "100-500",
    MID: "400-1500",
    HIGH: "1000-5000",
  };

  return (
    <Card>
      <CardHeader className="font-bold">
        {listing.type} Order #{listing.id}
      </CardHeader>
      <CardContent>
        <p>
          Range: {listing.range} ({ranges[listing.range as keyof typeof ranges]}
          )
        </p>
        <p className="text-sm text-gray-500">
          Posted {new Date(listing.timestamp).toLocaleString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Match Order</Button>
      </CardFooter>
    </Card>
  );
}
