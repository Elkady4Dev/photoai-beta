import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-wider border-[3px] border-retro-dark",
  {
    variants: {
      variant: {
        default: "bg-retro-dark text-retro-cream shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none rounded-lg",
        destructive: "bg-destructive text-destructive-foreground border-destructive shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[2px] hover:translate-y-[2px] rounded-lg",
        outline: "border-[3px] border-retro-dark text-retro-dark bg-transparent shadow-retro-sm hover:bg-retro-dark hover:text-retro-cream hover:shadow-retro-hover hover:translate-x-[2px] hover:translate-y-[2px] rounded-lg",
        secondary: "bg-retro-mustard text-retro-dark shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none rounded-lg",
        ghost: "border-transparent hover:bg-retro-peach-dark hover:text-retro-dark shadow-none rounded-lg",
        link: "text-retro-red underline-offset-4 hover:underline border-transparent shadow-none",
        hero: "bg-retro-red text-retro-cream shadow-retro-lg hover:shadow-retro-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-black rounded-lg",
        heroOutline: "border-[3px] border-retro-dark text-retro-dark bg-retro-cream shadow-retro-sm hover:bg-retro-dark hover:text-retro-cream hover:shadow-retro-hover hover:translate-x-[2px] hover:translate-y-[2px] rounded-lg",
        success: "bg-retro-teal text-retro-cream shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none rounded-lg",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 py-3 text-base",
        xl: "h-15 px-10 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
