"use client";
import { NobleEd25519Signer } from "@farcaster/hub-web";

import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";

import RegisterFIDButton from "./RegisterFIDButton";
import RentStorageUnitButton from "./RentStorageUnitButton";
import AddSignerButton from "./AddSignerButton";
import RegisterFNameButton from "./RegisterFNameButton";
import SendCastButton from "./SendCastButton";

import { use, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useNetwork,
  configureChains,
  createConfig,
  WagmiConfig,
  useConnect,
  useDisconnect,
} from "wagmi";
import { mainnet, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useFid } from "@/context/fidContext";
import { useSigner } from "@/context/signerContext";
import { useHub } from "@/context/hubContext";

import { Toaster } from "sonner";
import axios from "axios";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimism, mainnet],
  [publicProvider()]
);

// Set up client
const config = createConfig({
  autoConnect: true,
  connectors: [Web3AuthConnectorInstance(chains) as any],
  publicClient,
  webSocketPublicClient,
});

function Profile() {
  const { isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="text-white">
        <button
          className="w-28 inline-flex justify-center items-center gap-x-2 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  } else {
    return (
      <div className="main">
        {connectors.map((connector) => {
          return (
            <button
              className="w-48 inline-flex justify-center items-center gap-x-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              Login with {connector.name}
            </button>
          );
        })}
      </div>
    );
  }
}

export default function Checklist() {
  const { address, isConnected } = useAccount();
  const { fid, setFid } = useFid();
  const { signer, setSigner } = useSigner();
  const { idRegistryABI, ID_REGISTRY_ADDRESS } = useHub();
  const { chain } = useNetwork();

  const [step, setStep] = useState(1);

  const [recoveryAddress, setRecoveryAddress] = useState<string>("");
  const [fname, setFname] = useState<string>("");
  const [castText, setCastText] = useState("");
  const [castHash, setCastHash] = useState<string>("");
  const [disableRecoveryAddress, setDisableRecoveryAddress] =
    useState<boolean>(false);
  const [disableFname, setDisableFname] = useState<boolean>(false);
  const [hasStorage, setHasStorage] = useState<boolean>(false);

  const [registerFidTxHash, setRegisterFidTxHash] = useState<string>("");
  const [rentTxHash, setRentTxHash] = useState<string>("");
  const [addSignerTxHash, setAddSignerTxHash] = useState<string>("");

  const BLOCK_EXPLORER_URL = "https://optimistic.etherscan.io/"; // mainnet

  const { data: idOf } = useContractRead({
    address: ID_REGISTRY_ADDRESS,
    abi: idRegistryABI,
    functionName: "idOf",
    args: [address as any],
    enabled: Boolean(address),
    chainId: 10,
  });

  const { data: recoveryOf } = useContractRead({
    address: ID_REGISTRY_ADDRESS,
    abi: idRegistryABI,
    functionName: "recoveryOf",
    args: [fid as any],
    enabled: Boolean(fid),
    chainId: 10,
  });

  const gotoProfile = () => {
    window.location.href = `/profile/${fid}`;
  }
  const gotoFrames = () => {
    window.location.href = `/profile/${fid}/frames`;
  }

  const gotoGlobalFrames = () => {
    window.location.href = `/frames`;
  }

  // Function to render different sections based on the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
          { fid &&  <>

              <button onClick={gotoProfile} >
                Profile
              </button>
              <button onClick={gotoFrames} >
                Trending Personalize Frames
              </button>
              <button onClick={gotoGlobalFrames} >
                Trending Global Frames
              </button>
            </>
          }
            {/* Registration section */}
            <div className="relative flex items-start pb-4 pt-3.5">
              <div className="min-w-0 flex-1 text-sm leading-6">
                <label
                  htmlFor="comments"
                  className="font-medium text-gray-900 dark:text-white"
                >
                  Create account
                </label>
                <p
                  id="comments-description"
                  className="text-gray-500 dark:text-gray-400"
                >
                  Register a new Farcaster ID to your Ethereum address{" "}
                  <span className="text-blue-600 dark:text-blue-300">
                    {address}
                  </span>{" "}
                  <br />
                  and enter a recovery address.
                </p>
                <p
                  id="comments-description"
                  className="text-red-500 dark:text-red-400"
                >
                  Note: You should have $5-$10 worth of ETH balance on OP
                  Mainnet wallet to complete the registration process.
                </p>
                <div className="flex flex-row gap-x-1 text-gray-500 dark:text-gray-400">
                  {!!registerFidTxHash && <p>|</p>}
                  {!!registerFidTxHash && (
                    <a
                      href={`${BLOCK_EXPLORER_URL}tx/${registerFidTxHash}`}
                      target="_blank"
                      className="underline"
                    >
                      Show transaction
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  name="cast"
                  id="cast"
                  value={recoveryAddress}
                  onChange={(e) => setRecoveryAddress(e.target.value)}
                  className="mt-2 block w-2/4 rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:dark:bg-gray-800 disabled:dark:text-gray-400 disabled:dark:ring-gray-700 duration-100"
                  placeholder="Recovery address"
                  disabled={!isConnected || disableRecoveryAddress}
                  data-1p-ignore
                />
              </div>
              <RegisterFIDButton
                recoveryAddress={recoveryAddress}
                setRegisterFidTxHash={setRegisterFidTxHash}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Rent storage section */}
            <div className="relative flex items-start pb-4 pt-3.5">
              <div className="min-w-0 flex-1 text-sm leading-6">
                <label
                  htmlFor="candidates"
                  className="font-medium text-gray-900 dark:text-white"
                >
                  Rent storage
                </label>
                <p
                  id="candidates-description"
                  className="text-gray-500 dark:text-gray-400"
                >
                  Renting one unit of storage lets you store up to 5,000 casts
                  for a year. <br />
                  The fee helps reduce spam on the network.
                </p>
                <div className="flex flex-row gap-x-1 text-gray-500 dark:text-gray-400">
                  {!!rentTxHash && <p>|</p>}
                  {!!rentTxHash && (
                    <a
                      href={`${BLOCK_EXPLORER_URL}tx/${rentTxHash}`}
                      target="_blank"
                      className="underline"
                    >
                      Show transaction
                    </a>
                  )}
                </div>
              </div>
              <RentStorageUnitButton
                hasStorage={hasStorage}
                setHasStorage={setHasStorage}
                setRentTxHash={setRentTxHash}
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* Add signer section */}
            <div className="relative flex items-start pb-4 pt-3.5">
              <div className="min-w-0 flex-1 text-sm leading-6">
                <label
                  htmlFor="offers"
                  className="font-medium text-gray-900 dark:text-white"
                >
                  Add a signer
                </label>
                <p
                  id="offers-description"
                  className="text-gray-500 dark:text-gray-400"
                >
                  A signer is a key pair that lets you create new messages or
                  &quot;casts&quot;
                </p>
                <div className="flex flex-row gap-x-1 text-gray-500 dark:text-gray-400">
                  {!!addSignerTxHash && <p>|</p>}
                  {!!addSignerTxHash && (
                    <a
                      href={`${BLOCK_EXPLORER_URL}tx/${addSignerTxHash}`}
                      target="_blank"
                      className="underline"
                    >
                      Show transaction
                    </a>
                  )}
                </div>
              </div>
              <AddSignerButton setAddSignerTxHash={setAddSignerTxHash} />
            </div>
          </>
        );
      case 4:
        return (
          <>
            {/* Register fname section */}
            <div className="relative flex items-start pb-4 pt-3.5">
              <div className="min-w-0 flex-1 text-sm leading-6">
                <label
                  htmlFor="offers"
                  className="font-medium text-gray-900 dark:text-white"
                >
                  Register an fname{" "}
                  <span className="text-green-300 dark:text-green-200 font-normal">
                    (optional)
                  </span>
                </label>
                <p
                  id="offers-description"
                  className="text-gray-500 dark:text-gray-400"
                >
                  Acquire a free offchain ENS username issued by Farcaster.{" "}
                  <br />
                </p>

                <input
                  type="text"
                  name="fname"
                  id="fname"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="mt-2 block w-96 rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:dark:bg-gray-800 disabled:dark:text-gray-400 disabled:dark:ring-gray-700 duration-100"
                  placeholder="Enter your fname"
                  disabled={!isConnected || !fid || disableFname}
                  data-1p-ignore
                />
              </div>
              <RegisterFNameButton
                fname={fname}
                disableFname={disableFname}
                setDisableFname={setDisableFname}
              />
            </div>
          </>
        );
      case 5:
        return (
          <>
            {/* Publish cast section */}
            <div className="relative flex items-start pb-4 pt-3.5">
              <div className="min-w-0 flex-1 text-sm leading-6">
                <label
                  htmlFor="offers"
                  className="font-medium text-gray-900 dark:text-white"
                >
                  Publish a cast
                </label>
                <p
                  id="offers-description"
                  className="text-gray-500 dark:text-gray-400"
                >
                  Write a hello world message or cast that shows up on your
                  account.
                </p>
                <div className="flex flex-row gap-x-1 text-gray-500 dark:text-gray-400">
                  {!!castHash && <p>|</p>}
                  {!!castHash && !!fname && (
                    <a
                      href={`https://warpcast.com/${fname}/${castHash.slice(
                        0,
                        10
                      )}`}
                      target="_blank"
                      className="underline"
                    >
                      See on warpcast
                    </a>
                  )}
                  {!!castHash && !fname && (
                    <a
                      href={`https://warpcast.com/~/conversations/${castHash.slice(
                        0,
                        10
                      )}`}
                      target="_blank"
                      className="underline"
                    >
                      See on warpcast
                    </a>
                  )}
                  {!!castHash && !!fname && <p>|</p>}
                  {!!castHash && !!fname && (
                    <a
                      href={`https://flink.fyi/${fname}/${castHash}`}
                      target="_blank"
                      className="underline"
                    >
                      See on flink.fyi
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  name="cast"
                  id="cast"
                  onChange={(e) => setCastText(e.target.value)}
                  className="mt-2 block w-96 rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:dark:bg-gray-800 disabled:dark:text-gray-400 disabled:dark:ring-gray-700 duration-100"
                  placeholder="Type your cast"
                  disabled={!isConnected || !signer}
                />
              </div>
              <SendCastButton
                castText={castText}
                castHash={castHash}
                setCastHash={setCastHash}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log("Your FID is: " + idOf);
    if (idOf) {
      setFid(Number(idOf));
      setDisableRecoveryAddress(true);
    } else if (chain?.id !== 1) {
      setFid(0);
    }
  }, [chain?.id, idOf, setFid]);

  useEffect(() => {
    console.log("Your recovery address is: " + recoveryOf);
    if (recoveryOf !== undefined) {
      setRecoveryAddress(recoveryOf as any);
      setDisableRecoveryAddress(true);
    } else {
      setRecoveryAddress("");
      setDisableRecoveryAddress(false);
    }
  }, [recoveryOf]);

  useEffect(() => {
    if (fid !== 0) {
      console.log("checking signer");
      const privateKey = localStorage.getItem(`signerPrivateKey-${fid}`);
      if (privateKey !== null) {
        const ed25519Signer = new NobleEd25519Signer(
          Buffer.from(privateKey, "hex")
        );
        setSigner(ed25519Signer);
      }
    } else {
      setSigner(null);
    }

    if (fid !== 0) {
      // todo change to my hub
      console.log("checking storage units");
      axios
        .post("/api/v1/storage", { fid: fid })
        .then((response) => {
          setHasStorage(Boolean(response.data.limits[0].limit)); // mainnet
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setHasStorage(false);
    }

    if (fid !== 0) {
      console.log("checking fname");
      axios
        .get(`https://fnames.farcaster.xyz/transfers?fid=${fid}`)
        .then(function (response) {
          if (response.data.transfers.length > 0) {
            setFname(response.data.transfers[0].username); // mainnet
            setDisableFname(true); // mainnet
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setFname("");
      setDisableFname(false);
    }
  }, [fid, setSigner]);

  // Function to check if registration is done
  const isRegistrationDone = () => {
    return !!registerFidTxHash || !!fid;
  };

  return (
    <WagmiConfig config={config}>
      <fieldset className="border-gray-200 md:min-w-[1080px]">
        <Toaster richColors expand={true} />
        <div className="flex flex-row justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            CastConnect for Farcaster
          </h1>
          <Profile />
        </div>
        <div className="divide-y divide-gray-200">
          {renderStep()}
          {/* Navigation buttons */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-28 inline-flex mt-4 justify-center items-center gap-x-2 rounded-md bg-purple-600 disabled:bg-purple-200 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:shadow-none disabled:cursor-not-allowed hover:bg-purple-500 duration-100 dark:disabled:bg-purple-900 dark:disabled:bg-opacity-60 dark:disabled:text-gray-300"
              >
                Previous
              </button>
            )}
            {step < 5 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step < 5 && !isRegistrationDone()}
                className="w-28 inline-flex mt-4 justify-center items-center gap-x-2 rounded-md bg-purple-600 disabled:bg-purple-200 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:shadow-none disabled:cursor-not-allowed hover:bg-purple-500 duration-100 dark:disabled:bg-purple-900 dark:disabled:bg-opacity-60 dark:disabled:text-gray-300"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </fieldset>
    </WagmiConfig>
  );
}
