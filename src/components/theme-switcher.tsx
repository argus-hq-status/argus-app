import { Moon, Sun, Desktop } from "@phosphor-icons/react";
import { useTheme } from "./theme-provider";
import * as Dropdown from "./ui/dropdown";

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button 
          className="group relative flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-[#1a1a1a] dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          <Sun className="absolute size-4 rotate-0 scale-100 transition-all text-gray-700 dark:text-gray-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all text-gray-700 dark:text-gray-300 dark:rotate-0 dark:scale-100" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Content align="end" className="w-36">
        <Dropdown.Item onClick={() => setTheme("light")}>
          <Sun className="mr-2 size-4 text-gray-500" />
          <span>Light</span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTheme("dark")}>
          <Moon className="mr-2 size-4 text-gray-500" />
          <span>Dark</span>
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setTheme("system")}>
          <Desktop className="mr-2 size-4 text-gray-500" />
          <span>System</span>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
