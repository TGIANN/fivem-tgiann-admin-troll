import * as React from "react";

import { cn } from "@/lib/utils";
import { fetchNui } from "@/lib/fetchNui";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const setNuiFocusKeepInput = (isActive: boolean) => {
    fetchNui("setNuiFocusKeepInput", isActive);
  };

  return (
    <input
      type={type}
      onFocus={() => setNuiFocusKeepInput(false)}
      onBlur={() => setNuiFocusKeepInput(true)}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-[3.6vh] w-full min-w-0 rounded-[0.6vh] border bg-transparent px-[1.2vh] py-[0.4vh] text-[1.6vh] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-[2.8vh] file:border-0 file:bg-transparent file:text-[1.4vh] file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[1.4vh]",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0.3vh]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
