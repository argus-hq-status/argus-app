import { Moon, Sun, Desktop } from "@phosphor-icons/react";
import { useTheme } from "./theme-provider";
import * as Dropdown from "./ui/dropdown";

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button
          className="group relative flex size-8 items-center justify-center rounded-lg bg-control text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[color,background-color,transform] duration-150 hover:bg-control-hover hover:text-foreground active:scale-[0.96] focus:outline-none"
          aria-label="Toggle theme"
        >
          <Sun className="absolute size-4 rotate-0 scale-100 transition-[opacity,transform,filter] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)] dark:-rotate-90 dark:scale-25 dark:opacity-0 dark:blur-[4px]" />
          <Moon className="absolute size-4 rotate-90 scale-25 opacity-0 blur-[4px] transition-[opacity,transform,filter] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)] dark:rotate-0 dark:scale-100 dark:opacity-100 dark:blur-0" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Content align="end" className="w-36">
        <Dropdown.Item onClick={() => setTheme("light")}>
          <Sun className="mr-2 size-4 text-muted-foreground" />
          <span>Light</span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTheme("dark")}>
          <Moon className="mr-2 size-4 text-muted-foreground" />
          <span>Dark</span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTheme("system")}>
          <Desktop className="mr-2 size-4 text-muted-foreground" />
          <span>System</span>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
