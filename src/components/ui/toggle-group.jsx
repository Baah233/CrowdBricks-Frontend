import React, { createContext, useContext } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

// Simple context to pass variant/size down
const ToggleGroupContext = createContext({ variant: null, size: null });

const ToggleGroup = ({ className, variant, size, children, ...props }) => (
  <ToggleGroupPrimitive.Root
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
);

ToggleGroup.displayName = "ToggleGroup";

// Define a simple toggleVariants function or object mapping for styling
// Example placeholder:
const toggleVariants = ({ variant, size }) => {
  const variantClass = variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200 text-black";
  const sizeClass = size === "sm" ? "h-6 w-6" : "h-10 w-10";
  return `${variantClass} ${sizeClass} rounded`;
};

const ToggleGroupItem = ({ className, children, variant, size, ...props }) => {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
};

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
