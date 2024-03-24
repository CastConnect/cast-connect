import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import { useFid } from "@/context/fidContext";
import { useHub } from "@/context/hubContext";

import { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "sonner";

export default function RegisterFIDButton({
  recoveryAddress,
  setRegisterFidTxHash,
}: {
  recoveryAddress: string;
  setRegisterFidTxHash: (hash: string) => void;
}) {
  const { fid, setFid } = useFid();
  const { address, isConnected } = useAccount();
  const { idGatewayABI, ID_GATEWAY_ADDRESS } = useHub();

  const { data: price }: { data: bigint | undefined } = useContractRead({
    address: ID_GATEWAY_ADDRESS,
    abi: idGatewayABI,
    functionName: "price",
    chainId: 10,
  });

  const { config, isError, error } = usePrepareContractWrite({
    address: ID_GATEWAY_ADDRESS,
    abi: idGatewayABI,
    functionName: "register",
    args: [recoveryAddress as any],
    enabled: Boolean(recoveryAddress),
    value: BigInt(price ?? 0),
  });
  const { data: registerFidTxHash, write } = useContractWrite(config);

  const {
    data: txFid,
    isLoading,
    isSuccess: isSuccessTx,
  } = useWaitForTransaction({
    hash: registerFidTxHash?.hash,
  });

  const registerFid = async () => {
    if (isError) {
      toast.error("Error registering FID", { description: error?.message });
      console.log("Error registering FID", { description: error?.message });
    } else {
      write?.();
    }
  };

  useEffect(() => {
    if (isSuccessTx && fid === 0) {
      const newFid = parseInt(txFid?.logs[0].topics[2] as string, 16);
      setFid(newFid);
      toast.success(`FID ${newFid} registered!`);
    }
  }, [fid, isSuccessTx, setFid, txFid?.logs]);

  useEffect(() => {
    if (!!registerFidTxHash) {
      setRegisterFidTxHash(registerFidTxHash.hash);
    }
  }, [registerFidTxHash, setRegisterFidTxHash]);

  return (
    <button
      disabled={
        !isConnected ||
        address === undefined ||
        fid !== 0 ||
        !/^(0x)?[0-9a-fA-F]{40}$/i.test(recoveryAddress) ||
        recoveryAddress.toLowerCase() === address.toLowerCase()
      }
      onClick={() => registerFid()}
      type="button"
      className={`w-28 inline-flex justify-center items-center gap-x-2 rounded-md bg-purple-600 disabled:bg-purple-200 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:shadow-none disabled:cursor-not-allowed hover:bg-purple-500 duration-100 dark:disabled:bg-purple-900 dark:disabled:bg-opacity-60 dark:disabled:text-gray-300 ${
        fid && "!bg-green-500 !text-white !font-normal"
      }`}
    >
      {fid ? (
        `FID: ${fid}`
      ) : (
        <div className="inline-flex justify-center items-center gap-x-2">
          <PuffLoader color="#ffffff" size={20} loading={isLoading} />
          Register
        </div>
      )}
    </button>
  );
}
