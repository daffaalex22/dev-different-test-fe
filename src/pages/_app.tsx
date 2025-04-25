import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="light" forcedTheme="light">
      <Toaster richColors />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}



