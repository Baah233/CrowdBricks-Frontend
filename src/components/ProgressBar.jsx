import { cn } from "@/lib/utils";



export const ProgressBar = ({ 
  value, 
  className, 
  showAnimation = true 
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={cn("w-full bg-muted rounded-full overflow-hidden", className)}>
      <div
        className={cn(
          "h-full bg-gradient-to-r from-secondary to-secondary-light rounded-full transition-all duration-1000 ease-out",
          showAnimation && "animate-progress"
        )}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
};