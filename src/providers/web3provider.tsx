"use client";

import Web3AuthConnectorInstance from "@/components/Web3AuthConnectorInstance";
import { FC, PropsWithChildren } from "react";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { optimism, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimism, mainnet],
  [publicProvider()]
);

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
    connectors: [Web3AuthConnectorInstance(chains) as any],
    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
      "04309ed1007e77d1f119b85205bb779d",

    chains: [optimism, mainnet],

    // Required
    appName: "Sign up for Farcaster with Web3Auth",

    // Optional
    appDescription:
      "Simple app illustrating how to sign up for Farcaster using your Web3Auth account.",
    appUrl: "https://castconnect.vercel.app", // your app's url
    appIcon:
      "https://framerusercontent.com/modules/jVMp8b8ZfTZpbLnhDiml/NV8p4XHr9GEQFJDJsKKb/assets/DE2CvWySqIW7eDC8Ehs5bCK6g.svg", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const Web3Provider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <WagmiConfig config={config}>
    <ConnectKitProvider>{children}</ConnectKitProvider>
  </WagmiConfig>
);

export default Web3Provider;
