"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type BreadcrumbItem = { label: string; href?: string };

export type HeaderConfig = {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
};

const LayoutContext = createContext<{
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
}>({
  config: { title: "Dashboard" },
  setConfig: () => {},
});

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>({ title: "Dashboard" });
  return (
    <LayoutContext.Provider value={{ config, setConfig }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useHeader() {
  return useContext(LayoutContext);
}

function breadcrumbEq(a?: BreadcrumbItem[], b?: BreadcrumbItem[]) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((item, i) => item.label === b[i].label && item.href === b[i].href);
}

export function useSetHeader(config: HeaderConfig) {
  const { setConfig } = useContext(LayoutContext);
  const prev = useRef<HeaderConfig | null>(null);

  useEffect(() => {
    const last = prev.current;
    if (
      !last ||
      last.title !== config.title ||
      last.description !== config.description ||
      !breadcrumbEq(last.breadcrumb, config.breadcrumb)
    ) {
      prev.current = config;
      setConfig(config);
    }
  });
}
