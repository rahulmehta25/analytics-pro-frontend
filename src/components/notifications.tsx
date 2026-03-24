"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 10, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut",
        }}
      >
        <Bell className="h-5 w-5" />
      </motion.div>
      <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
    </Button>
  );
}
