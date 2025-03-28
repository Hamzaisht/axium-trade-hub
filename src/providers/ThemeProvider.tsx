
import { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
