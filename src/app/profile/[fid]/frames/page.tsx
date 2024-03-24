import Image from "next/image";
const GraphCast = 'https://graph.cast.k3l.io'
const getPersonalizeFrames = async (fid) => {
    let params = new URLSearchParams()
    params.append('agg', 'sumsquare')
    params.append('weight', 'L1C10R5')
    params.append('voting', 'single')
    params.append('limit', '10')
    params.append('k', '2')

    const result = await fetch(`${GraphCast}/frames/personalized/rankings/fids?${params.toString()}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([fid])
    })
    const resultJson = await result.json()
    return resultJson.result
}


export default async function Home({ params }: { params: { fid: string } }) { 
    console.log(params.fid)   
   let result = await getPersonalizeFrames(params.fid)


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {result.map((frame: any) => {
            return (
                <div key={frame.url} className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                        {frame.url}
                    </p>
                </div>
            )
            })
        }
    </main>
  );
}
