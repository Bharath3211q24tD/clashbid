import localFont from "next/font/local";

export const rajdhani = localFont({
  src: [
    {
      path: "../fonts/rajdhani-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/rajdhani-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/rajdhani-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-rajdhani",
  display: "swap",
  fallback: ["Segoe UI", "sans-serif"],
});

export const inter = localFont({
  src: [
    {
      path: "../fonts/inter-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
