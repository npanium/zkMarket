import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          DM
        </Link>
        <div className="flex gap-4">
          <Link href="/create">
            <Button variant="ghost">Create</Button>
          </Link>
          <Link href="/orders">
            <Button variant="ghost">Orders</Button>
          </Link>
          <Button>Connect Wallet</Button>
        </div>
      </div>
    </nav>
  );
}
