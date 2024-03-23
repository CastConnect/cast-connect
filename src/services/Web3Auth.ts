// Web3Auth Libraries
// import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  OpenloginAdapter,
  OPENLOGIN_NETWORK,
} from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";
// import { Chain } from "wagmi";
interface Chain {
  id: number;
  name: string;
  rpcUrls: { default: { http: string[] } };
  nativeCurrency: { name: string; symbol: string };
  blockExplorers: { default: { url: string[] } };
}

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance
  const iconUrl = "https://web3auth.io/docs/contents/logo-ethereum.png";
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url[0] as string,
    iconUrl,
  };
  
  // Add openlogin adapter for customisations
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  const web3AuthInstance = new Web3Auth({
    clientId:
      "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
    chainConfig,
    // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
    // Please remove this parameter if you're on the Base Plan
    uiConfig: {
      appName: "W3A Farcaster",
      // appLogo: "https://web3auth.io/images/web3auth-logo.svg", // Your App Logo Here
      theme: {
        primary: "#9334e9",
      },
      mode: "dark",
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
      loginGridCol: 3,
      primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
      modalZIndex: "2147483647",
    },
    web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
    enableLogging: true,
    privateKeyProvider,
  });


  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      uxMode: "redirect",
    },
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);
  return web3AuthInstance
}

export class Web3AuthService {
  static web3AuthInstance: Web3Auth;
  constructor(chains: Chain[]) {
    Web3AuthService.web3AuthInstance = Web3AuthConnectorInstance(chains);
  }
  static getWeb3AuthInstance( chains?: Chain[]) {
    if (!Web3AuthService.web3AuthInstance) {
      if (!chains) {
        throw new Error("Chain is required to initialize Web3Auth");
      }
      Web3AuthService.web3AuthInstance = Web3AuthConnectorInstance(chains);
    }
    return Web3AuthService.web3AuthInstance;
  }
}
