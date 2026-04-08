"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMonthName } from "@/lib/calendar-utils";
import { getMonthMeta } from "@/lib/month-images";

interface HeroImageProps {
  month: number;
  year: number;
  direction: number;
}

export function HeroImage({ month, year, direction }: HeroImageProps) {
  const meta = getMonthMeta(month);

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-72 rounded-2xl overflow-hidden mb-6">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${month}-${year}`}
          custom={direction}
          initial={{
            opacity: 0,
            rotateY: direction * 90,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            rotateY: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            rotateY: direction * -90,
            scale: 0.95,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
          className="absolute inset-0"
          style={{ perspective: "1200px" }}
        >
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br",
              "from-(--cal-accent)/80 via-(--cal-accent)/40 to-(--cal-dark)/60"
            )}
            style={{
              backgroundImage: `url(${meta.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-br from-(--cal-accent)/30 to-transparent mix-blend-overlay" />

          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-white/60 text-xs font-medium tracking-widest uppercase mb-1">
                {meta.season} · {year}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight leading-none">
                {getMonthName(month)}
              </h1>
              <p className="text-white/70 text-sm mt-2 max-w-md">
                {meta.description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
