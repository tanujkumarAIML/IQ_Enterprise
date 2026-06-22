import { useState, useCallback, useEffect } from "react";
import api from "../services/api";

/** Generic fetch hook */
export const useFetch = (url, options = {}) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async (overrideUrl, body) => {
    setLoading(true); setError(null);
    try {
      const method   = options.method || "get";
      const endpoint = overrideUrl || url;
      const res      = method === "get"
        ? await api.get(endpoint)
        : await api[method](endpoint, body);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || "Error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options.method]);

  return { data, loading, error, fetch };
};

/** Countdown timer hook */
export const useCountdown = (initialSeconds = 120, onEnd) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [running,  setRunning]  = useState(false);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) { setRunning(false); onEnd?.(); return; }
    const id = setInterval(() => setTimeLeft((t) => {
      if (t <= 1) { clearInterval(id); setRunning(false); onEnd?.(); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running, timeLeft]);

  const start = useCallback(() => setRunning(true),  []);
  const stop  = useCallback(() => setRunning(false), []);
  const reset = useCallback((s) => { setTimeLeft(s ?? initialSeconds); setRunning(false); }, [initialSeconds]);

  return { timeLeft, running, start, stop, reset };
};

/** localStorage hook */
export const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial; }
    catch { return initial; }
  });
  const set = useCallback((v) => {
    setValue(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [value, set];
};

/** Debounce hook */
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

/** Window size hook */
export const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
};
