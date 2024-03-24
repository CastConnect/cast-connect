"use client";
import axios from "axios";
// HubContext.js
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Hex } from "viem";

type HubContextType = {
  idRegistryABI: any;
  setIdRegistryABI: React.Dispatch<any>;
  idGatewayABI: any;
  setIdGatewayABI: React.Dispatch<any>;
  storageRegistryABI: any;
  setStorageRegistryABI: React.Dispatch<any>;
  keyGatewayABI: any;
  setKeyGatewayABI: React.Dispatch<any>;
  ID_REGISTRY_ADDRESS: Hex;
  ID_GATEWAY_ADDRESS: Hex;
  STORAGE_REGISTRY_ADDRESS: Hex;
  KEY_GATEWAY_ADDRESS: Hex;
};

const HubContext = createContext<HubContextType | null>(null);

export const HubProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const ID_REGISTRY_ADDRESS = "0x00000000Fc6c5F01Fc30151999387Bb99A9f489b";
  const ID_GATEWAY_ADDRESS = "0x00000000Fc25870C6eD6b6c7E41Fb078b7656f69";
  const STORAGE_REGISTRY_ADDRESS = "0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D";
  const KEY_GATEWAY_ADDRESS = "0x00000000fC56947c7E7183f8Ca4B62398CaAdf0B";
  const [idRegistryABI, setIdRegistryABI] = useState<any>();
  const [idGatewayABI, setIdGatewayABI] = useState<any>();
  const [storageRegistryABI, setStorageRegistryABI] = useState<any>();
  const [keyGatewayABI, setKeyGatewayABI] = useState<any>();

  useEffect(() => {
    axios.get("/hub").then(function (response) {
      setIdRegistryABI(response.data.idRegistryABI);
      setIdGatewayABI(response.data.idGatewayABI);
      setStorageRegistryABI(response.data.storageRegistryABI);
      setKeyGatewayABI(response.data.keyGatewayABI);
    });
  }, []);

  return (
    <HubContext.Provider
      value={{
        idRegistryABI,
        setIdRegistryABI,
        idGatewayABI,
        setIdGatewayABI,
        storageRegistryABI,
        setStorageRegistryABI,
        keyGatewayABI,
        setKeyGatewayABI,
        ID_REGISTRY_ADDRESS,
        ID_GATEWAY_ADDRESS,
        STORAGE_REGISTRY_ADDRESS,
        KEY_GATEWAY_ADDRESS,
      }}
    >
      {children}
    </HubContext.Provider>
  );
};

export const useHub = () => {
  const context = useContext(HubContext);
  if (!context) {
    throw new Error("useFid must be used within a FidProvider");
  }
  return context;
};
