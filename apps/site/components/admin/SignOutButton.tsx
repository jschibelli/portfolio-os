"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/login" })}
      variant="outline"
      size="sm"
      className="border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-800 hover:border-stone-300 transition-colors"
    >
      Sign Out
    </Button>
  );
}
