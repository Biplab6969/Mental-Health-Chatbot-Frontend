"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type ToastVariant = "default" | "destructive";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
};

type Toast = ToastOptions & { id: string };

type ToastContextType = {
  toast: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((opts: ToastOptions) => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2);
    const toast: Toast = { id, ...opts };
    setToasts((t) => [toast, ...t]);

    // Auto-remove after 4s
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: add }}>
      {children}

      {/* Toast viewport */}
      <div aria-live="polite" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              `w-full max-w-sm rounded-md p-3 shadow-lg transform-gpu transition-all duration-200 ease-in-out ` +
              (t.variant === "destructive"
                ? "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
                : "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]")
            }
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm opacity-90 mt-1">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export default useToast;
