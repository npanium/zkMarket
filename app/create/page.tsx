"use client";

import { CreateListingForm } from "@/components/create-listing-form";

export default function CreateListing() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create Listing</h1>
      <CreateListingForm />
    </div>
  );
}
