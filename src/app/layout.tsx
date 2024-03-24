import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "@/providers/web3provider";
import { FidProvider } from "@/context/fidContext";
import { SignerProvider } from "@/context/signerContext";
import { HubProvider } from "@/context/hubContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sign up for Farcaster with Web3Auth",
  description:
    "Simple app illustrating how to sign up for Farcaster using your Web3Auth account.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link
        rel="icon"
        href="https://framerusercontent.com/modules/jVMp8b8ZfTZpbLnhDiml/NV8p4XHr9GEQFJDJsKKb/assets/DE2CvWySqIW7eDC8Ehs5bCK6g.svg"
      ></link>
      <body className={inter.className}>
        <ClientLayout>
          <HubProvider>
            <FidProvider>
              <SignerProvider>{children}</SignerProvider>
            </FidProvider>
          </HubProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
