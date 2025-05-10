
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TrendDirection } from "@/types/dashboard";
import { TrendingUp, TrendingDown, MinusIcon } from "lucide-react";

const badgeDeltaVariants = cva(
  "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      deltaType: {
        up: "bg-green-50 text-green-700 ring-green-600/20",
        down: "bg-red-50 text-red-700 ring-red-600/20",
        neutral: "bg-gray-50 text-gray-700 ring-gray-600/20",
      },
    },
    defaultVariants: {
      deltaType: "neutral",
    },
  }
);

export interface BadgeDeltaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeDeltaVariants> {
  deltaType?: TrendDirection;
}

export function BadgeDelta({
  className,
  deltaType = "neutral",
  ...props
}: BadgeDeltaProps) {
  return (
    <div className={cn(badgeDeltaVariants({ deltaType }), className)} {...props}>
      {deltaType === "up" && <TrendingUp className="mr-1 h-3 w-3 text-green-600" />}
      {deltaType === "down" && <TrendingDown className="mr-1 h-3 w-3 text-red-600" />}
      {deltaType === "neutral" && <MinusIcon className="mr-1 h-3 w-3 text-gray-500" />}
      {props.children}
    </div>
  );
}
