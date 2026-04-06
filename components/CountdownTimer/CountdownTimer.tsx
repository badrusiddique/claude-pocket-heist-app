"use client";

import { useState, useEffect } from "react";
import { Clock8 } from "lucide-react";
import styles from "./CountdownTimer.module.css";

interface Props {
  expiresAt: Date;
}

export function formatCountdown(expiresAt: Date): string {
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();

  if (diffMs <= 0) return "Expired";

  const totalSeconds = Math.floor(diffMs / 1000);

  if (totalSeconds < 60) {
    return `${totalSeconds}s remaining`;
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return `${parts.join(" ")} remaining`;
}

export default function CountdownTimer({ expiresAt }: Props) {
  const [display, setDisplay] = useState<string>(() =>
    formatCountdown(expiresAt),
  );

  useEffect(() => {
    if (expiresAt <= new Date()) {
      return;
    }

    let interval: ReturnType<typeof setInterval>;

    const tick = () => {
      const text = formatCountdown(expiresAt);
      setDisplay(text);
      if (text === "Expired") clearInterval(interval);
    };

    interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpired = display === "Expired";

  return (
    <span className={isExpired ? styles.expired : styles.active}>
      <Clock8 size={14} aria-hidden />
      {display}
    </span>
  );
}
