import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";


export const metadata: Metadata = {
  title: "Dynamic Form Builder",
  description: "Qualifier 2 - Build a dynamic form application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system" // You can change this to "light" or "dark"
            enableSystem
            disableTransitionOnChange
        >
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
