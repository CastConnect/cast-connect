import {
  getInsecureHubRpcClient,
  Message,
  idGatewayABI,
  idRegistryABI,
  storageRegistryABI,
  keyGatewayABI,
} from "@farcaster/hub-nodejs";

const HUB_URL = "3.17.4.160:2283";

const HUB_URL_FROM_ENV = process.env.HUB_URL || HUB_URL;

const client = getInsecureHubRpcClient(HUB_URL_FROM_ENV);

export async function POST(req: Request) {
  const data = await req.json();
  const message = Message.fromJSON(data.message);
  const result = await client.submitMessage(message);

  console.log(result);

  if (result.isErr()) {
    return new Response(result.error.message, { status: 400 });
  }

  return new Response(JSON.stringify(result));
}

// Return the ABI and address of the ID registry contract in a GET request
export async function GET(req: Request) {
  return new Response(
    JSON.stringify({
      idRegistryABI,
      idGatewayABI,
      storageRegistryABI,
      keyGatewayABI,
    })
  );
}
