"use client";

import { useEffect, useState } from "react";

/** Live IST clock, hydration-safe (renders dashes until mounted). */
export function useISTClock(withSeconds = true): string {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: withSeconds ? "2-digit" : undefined,
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [withSeconds]);

  return time;
}
