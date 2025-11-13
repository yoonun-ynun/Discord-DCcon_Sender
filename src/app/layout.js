import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./Provider"
import Provider from "@/app/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DCcon Sender",
  description: "The Discord bot about DCcon sender",
};

export default function RootLayout({ children }) {
  return (
      <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Provider>
        {children}
      </Provider>
      </body>
      </html>
  );
}
