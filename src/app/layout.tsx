"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactQueryProvider from "../../hooks/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Inter } from "next/font/google";
import "./globals.css";

const queryClient = new QueryClient();
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <ReactQueryProvider>
          <GoogleOAuthProvider clientId="128850958342-mgnd19ama41spdfr6jrm2ovov3puhabn.apps.googleusercontent.com">
            <body className={inter.className}>{children}</body>
            <Toaster />
            <ReactQueryDevtools />
          </GoogleOAuthProvider>
        </ReactQueryProvider>
      </QueryClientProvider>
    </html>
  );
}
