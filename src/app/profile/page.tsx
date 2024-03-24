import { redirect } from "next/navigation";


const HUB_HTTPS_URL =
  process.env.HUB_HTTP_URL || "http://nemes.farcaster.xyz:2281";


type USER_PROFILE = {
    USER_DATA_TYPE_USERNAME: string,
    USER_DATA_TYPE_PFP: string,
    USER_DATA_TYPE_BIO: string,
    USER_DATA_TYPE_DISPLAY: string,
}

async function getUserData(fid: string) {
  const result = await fetch(
    `${HUB_HTTPS_URL}/v1/userDataByFid?fid=${fid}`,
    { headers: {
        "Content-Type": "application/json",
        api_key: process.env.HUB_API_KEY || "test",
    } }
  );
  const resultJson = await result.json() as {messages: { data : any } []} ;
    let userPro : Record<string, string> = {}
    resultJson.messages.forEach((item) => {
        const type = item.data.userDataBody.type as string || "empty"
        userPro[type] = item.data.userDataBody.value
    })
    return userPro;
}

export default async function Page() {    
 
  redirect('/404')
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //       {result.USER_DATA_TYPE_PFP && <Image src={result.USER_DATA_TYPE_PFP} alt="Profile Picture" width={200} height={200} />}
  //       {result.USER_DATA_TYPE_USERNAME && <h1>{result.USER_DATA_TYPE_USERNAME}</h1>}
  //       {result.USER_DATA_TYPE_DISPLAY && <h2>{result.USER_DATA_TYPE_DISPLAY}</h2>}
  //       {result.USER_DATA_TYPE_BIO && <p>{result.USER_DATA_TYPE_BIO}</p>}
  //   </main>
  // );
}