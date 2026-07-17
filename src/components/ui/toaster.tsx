"use client";

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          open={true}
          onOpenChange={(open) => { if (!open) dismiss(t.id); }}
          variant={t.variant}
          duration={t.duration}
        >
          <div className="flex flex-col gap-1">
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
