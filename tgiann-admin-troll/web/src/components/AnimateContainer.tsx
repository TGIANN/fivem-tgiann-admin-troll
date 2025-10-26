import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function AnimateContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      key={"main"}
      initial={{ opacity: 0.0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0.0, scale: 0.8 }}
      className={cn(
        "bg-background text-accent-foreground absolute transition-all duration-300 rounded-[0.6vh]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
