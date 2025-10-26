import * as React from "react";
import { badgeVariants } from "./badgeVariants";
import { cn } from "@/lib/utils"; // your className merge helper

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
