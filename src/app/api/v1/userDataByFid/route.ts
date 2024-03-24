import axios from "axios";

const HUB_HTTPS_URL =
  process.env.HUB_HTTP_URL || "http://nemes.farcaster.xyz:2281";

const headers = {
  "Content-Type": "application/json",
  api_key: process.env.HUB_API_KEY,
};

export async function POST(req: Request) {
  const data = await req.json();
  const fid = data.fid;

  const result = await axios.get(
    `${HUB_HTTPS_URL}/v1/userDataByFid?fid=${fid}`,
    { headers }
  );

//   const result = data
  console.log(result);

  return new Response(JSON.stringify(result.data));
}
