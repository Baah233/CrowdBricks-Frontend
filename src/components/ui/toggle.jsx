import React, { forwardRef } from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { toggleVariants } from "./toggleVariants";

const Toggle = forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={toggleVariants({ variant, size, className })}
    {...props}
  />
));

Toggle.displayName = "Toggle";

export { Toggle };
