import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SocketProvider from "./providers/SocketProvider";
import QueryClientContext from "./providers/QueryClientContext";
import { MantineProvider } from "@mantine/core";

import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";

import "@mantine/core/styles.css";
import { RootStyleRegistry } from "./EmotionRootStyleRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hlasovací systém MORS",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootStyleRegistry>
          <MantineEmotionProvider>
            <MantineProvider stylesTransform={emotionTransform}>
              <QueryClientContext>
                <SocketProvider>{children}</SocketProvider>
              </QueryClientContext>
            </MantineProvider>
          </MantineEmotionProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
