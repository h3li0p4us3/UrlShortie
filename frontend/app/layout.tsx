import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "UrlShortie",
  description: "Shorten your URLs with ease - written in Js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        {children}
      </body>
    </html>
  );
}
