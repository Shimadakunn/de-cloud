"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState,useEffect } from "react";
import Scrumble from "@/components/ui/scrumble-text/scrumble";
import { Button } from "@/components/ui/button";

import { Web5 } from "@web5/api";

const MyPage = () => {
  const router = useRouter();

  // const [web5, setWeb5] = useState<Web5>();
  // const [myDid, setMyDid] = useState<string>('');

  // useEffect(() => {
  //   const connectWeb5 = async () => {
  //     const web5Result = await Web5.connect();
  //     setWeb5(web5Result.web5);
  //     setMyDid(web5Result.did);
  //   }
  //   connectWeb5();
  // }, []);
  
  return (
    <main className="bg-[url('../public/background.png')] bg-cover flex items-center justify-center w-screen h-screen space-y-4">
      <div className="w-full h-full flex flex-col items-left justify-center p-32">
        <div className="text-8xl font-[SFPro] font-semibold">
          De-Cloud
        </div>
        <div className="text-3xl mt-12 mb-12">
          <Scrumble />
        </div>
      <Button 
      className="w-32"
      onClick={() => {
              router.push("/password");
            }}>
        Get Started
      </Button>
      </div>
      <div className="w-full">
      {/* {myDid} */}
      </div>
    </main>
  
  );
};

export default MyPage;
