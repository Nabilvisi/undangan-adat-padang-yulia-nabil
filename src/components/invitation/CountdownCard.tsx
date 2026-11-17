"use client";

import React, { useEffect, useState } from "react";
import { MinangThemePalette } from "@/lib/themes";

interface CountdownCardProps {
  targetDate: string;
  theme: MinangThemePalette;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calculateTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime();
  if (Number.isNaN(target)) {
    return ZERO_TIME;
  }
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownCard({ targetDate, theme }: CountdownCardProps) {
  // Initialize deterministically for SSR so server and client hydration always match
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO_TIME);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const blocks = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {blocks.map((b) => (
        <div
          key={b.label}
          className="flex flex-col items-center justify-center rounded-lg py-3 px-2 shadow-sm"
          style={{
            backgroundColor: theme.cardBgAlt,
            border: `1px solid ${theme.accentGold}66`,
          }}
        >
          <span
            className="tabular-nums-editorial font-serif text-2xl font-bold leading-none"
            style={{ color: theme.textOnCard }}
          >
            {String(b.value).padStart(2, "0")}
          </span>
          <span
            className="mt-1.5 font-display text-[9px] uppercase tracking-[0.18em]"
            style={{ color: theme.textOnCardMuted }}
          >
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
