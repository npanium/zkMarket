import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  // Mock data
  const listings = [
    { id: 1, range: "LOW", type: "SELL", timestamp: Date.now() },
    { id: 2, range: "MID", type: "SELL", timestamp: Date.now() - 3600000 },
    { id: 3, range: "HIGH", type: "BUY", timestamp: Date.now() - 7200000 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">zkMarket</h1>
        <Link href="/create">
          <Button>Create Listing</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
