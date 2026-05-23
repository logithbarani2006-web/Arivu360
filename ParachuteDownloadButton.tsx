import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParachuteDownloadButtonProps {
  label?: string;
  onDownload?: () => Promise<void> | void;
  className?: string;
}

const ParachuteDownloadButton = ({
  label = "Download",
  onDownload,
  className,
}: ParachuteDownloadButtonProps) => {
  const [state, setState] = useState<"idle" | "downloading" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("downloading");
    setProgress(0);

    // Simulate download progress
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        setTimeout(async () => {
          if (onDownload) await onDownload();
          setState("complete");
          setTimeout(() => setState("idle"), 3000);
        }, 300);
      } else {
        setProgress(Math.round(p));
      }
    }, 120);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative w-[120px] h-[140px] flex flex-col items-center justify-center bg-transparent border-none cursor-pointer outline-none group",
        state !== "idle" && "pointer-events-none",
        className
      )}
    >
      {/* Circle / Progress ring */}
      <div className="relative w-[100px] h-[100px]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="hsl(var(--secondary) / 0.2)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={276.46}
            strokeDashoffset={276.46 - (276.46 * progress) / 100}
            transform="rotate(-90 50 50)"
            initial={false}
          />
        </svg>

        {/* Arrow / Parachute area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="arrow"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {/* Download arrow */}
                <svg
                  viewBox="0 0 48 48"
                  className="w-10 h-10 fill-secondary group-hover:scale-110 transition-transform duration-300"
                >
                  <path d="M23.191 46.588C23.379 46.847 23.68 47 24 47C24.32 47 24.621 46.847 24.809 46.588L40.809 24.588C41.03 24.284 41.062 23.881 40.892 23.546C40.72 23.211 40.376 23 40 23H31V2C31 1.448 30.552 1 30 1H18C17.448 1 17 1.448 17 2V23H7.99999C7.62399 23 7.27999 23.211 7.10899 23.546C6.93799 23.881 6.96999 24.284 7.19199 24.588L23.191 46.588Z" />
                </svg>
              </motion.div>
            )}

            {state === "downloading" && (
              <motion.div
                key="parachute"
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Parachute */}
                <motion.svg
                  viewBox="0 0 28 32"
                  className="w-7 h-8 fill-secondary"
                  animate={{
                    x: [0, -4, 4, -2, 2, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path d="M27.5 20.2542C26.9093 23.9345 24.4253 32 14 32C3.57466 32 1.09075 23.9345 0.5 20.2542L0.502764 19.04L12.756 0H15.244L27.4972 19.04C27.4972 19.4629 27.5 20.2542 27.5 20.2542ZM25.8243 19.0357L14.933 3.0248V18.5033C15.9843 18.5979 16.8727 18.8393 17.7587 19.0801C18.887 19.3867 20.0115 19.6923 21.4639 19.6923C22.9864 19.6923 24.6154 19.3565 25.8243 19.0357ZM13.067 18.5033V3.0248L2.17572 19.0357C3.38456 19.3565 5.01356 19.6923 6.5361 19.6923C7.98852 19.6923 9.113 19.3867 10.2413 19.0801C11.1273 18.8393 12.0157 18.5979 13.067 18.5033Z" />
                </motion.svg>
                {/* Small arrow below parachute */}
                <motion.svg
                  viewBox="0 0 48 48"
                  className="w-6 h-6 fill-secondary mt-0.5"
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M23.191 46.588C23.379 46.847 23.68 47 24 47C24.32 47 24.621 46.847 24.809 46.588L40.809 24.588C41.03 24.284 41.062 23.881 40.892 23.546C40.72 23.211 40.376 23 40 23H31V2C31 1.448 30.552 1 30 1H18C17.448 1 17 1.448 17 2V23H7.99999C7.62399 23 7.27999 23.211 7.10899 23.546C6.93799 23.881 6.96999 24.284 7.19199 24.588L23.191 46.588Z" />
                </motion.svg>
              </motion.div>
            )}

            {state === "complete" && (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <svg
                  viewBox="0 0 48 48"
                  className="w-10 h-10 fill-secondary"
                >
                  <path d="M28.5858 10.0503C29.3669 9.2692 30.6332 9.2692 31.4142 10.0503L42.5 21.136C43.8807 22.5167 43.8807 24.7553 42.5 26.136C41.1193 27.5168 38.8807 27.5167 37.5 26.136L31.4142 20.0502C30.6332 19.2692 29.3669 19.2692 28.5858 20.0503L10.5 38.136C9.11931 39.5167 6.88073 39.5168 5.50002 38.136C4.11931 36.7553 4.11931 34.5167 5.50002 33.136L28.5858 10.0503Z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Label / progress text */}
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.span
            key="label"
            className="text-sm font-semibold text-secondary mt-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {label}
          </motion.span>
        )}
        {state === "downloading" && (
          <motion.span
            key="progress"
            className="text-sm font-bold text-secondary mt-1 tabular-nums"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {progress}%
          </motion.span>
        )}
        {state === "complete" && (
          <motion.span
            key="complete"
            className="text-sm font-semibold text-secondary mt-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            Complete
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ParachuteDownloadButton;
