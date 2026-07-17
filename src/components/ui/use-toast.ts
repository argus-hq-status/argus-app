"use client";

import { useState, useEffect, useCallback } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type Listener = (toast: Toast) => void;

let toastCount = 0;
const listeners = new Set<Listener>();

function dispatch(toast: Toast) {
  listeners.forEach((fn) => fn(toast));
}

export function toast(options: ToastOptions) {
  const id = String(++toastCount);
  dispatch({ id, ...options });
  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler: Listener = (t) => {
      setToasts((prev) => [...prev, t]);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
