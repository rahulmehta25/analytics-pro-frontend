"use client";
import { useEffect, useState, useRef, useCallback } from "react";

export function usePolling(fetchFn: () => Promise<void>, intervalMs: number = 60000) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const visibleRef = useRef(true);

  const refresh = useCallback(async () => {
    if (!visibleRef.current) return;
    setIsRefreshing(true);
    try {
      await fetchFn();
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    function onVisChange() {
      visibleRef.current = !document.hidden;
    }
    document.addEventListener("visibilitychange", onVisChange);
    return () => document.removeEventListener("visibilitychange", onVisChange);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(refresh, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh, intervalMs]);

  const timeAgo = () => {
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return { lastUpdated, isRefreshing, timeAgo, refresh };
}
