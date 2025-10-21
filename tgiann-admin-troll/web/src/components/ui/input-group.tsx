import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-[0.6vh] border shadow-xs transition-[color,box-shadow] outline-none",
        "h-[3.6vh] min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-[0.8vh]",
        "has-[>[data-align=inline-end]]:[&>input]:pr-[0.8vh]",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-[1.2vh]",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-[1.2vh]",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[0.3vh]",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-[0.8vh] py-[0.6vh] text-[1.4vh] font-medium select-none [&>svg:not([class*='size-'])]:size-[1.6vh] [&>kbd]:rounded-[calc(var(--radius)-0.5vh)] group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-[1.2vh] has-[>button]:ml-[-0.7vh] has-[>kbd]:ml-[-0.5vh]",
        "inline-end":
          "order-last pr-[1.2vh] has-[>button]:mr-[-0.7vh] has-[>kbd]:mr-[-0.5vh]",
        "block-start":
          "order-first w-full justify-start px-[1.2vh] pt-[1.2vh] [.border-b]:pb-[1.2vh] group-has-[>input]/input-group:pt-[1vh]",
        "block-end":
          "order-last w-full justify-start px-[1.2vh] pb-[1.2vh] [.border-t]:pt-[1.2vh] group-has-[>input]/input-group:pb-[1vh]",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "text-[1.4vh] shadow-none flex gap-[0.8vh] items-center",
  {
    variants: {
      size: {
        xs: "h-[2.4vh] gap-[0.4vh] px-[0.8vh] rounded-[calc(var(--radius)-0.5vh)] [&>svg:not([class*='size-'])]:size-[1.4vh] has-[>svg]:px-[0.8vh]",
        sm: "h-[3.2vh] px-[1vh] gap-[0.6vh] rounded-[0.6vh] has-[>svg]:px-[1vh]",
        "icon-xs":
          "size-[2.4vh] rounded-[calc(var(--radius)-0.5vh)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-[3.2vh] p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-[0.8vh] text-[1.4vh] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[1.6vh]",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-[1.2vh] shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
