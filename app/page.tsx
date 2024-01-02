"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState,useEffect } from "react";
import Scrumble from "@/components/ui/scrumble-text/scrumble";
import { Button } from "@/components/ui/button";

import { Web5 } from "@web5/api";

const MyPage = () => {
  const router = useRouter();

  const [web5, setWeb5] = useState<Web5>();
  const [myDid, setMyDid] = useState<string>('');

  useEffect(() => {

    const initWeb5 = async () => {
      // @ts-ignore
      const { Web5 } = await import('@web5/api');
      
      try {
        const { web5, did } = await Web5.connect({sync: '5s'});
        setWeb5(web5);
        setMyDid(did);
        console.log(web5);
        if (web5 && did) {
          console.log('Web5 initialized');
          // await configureProtocol(web5, did);
        }
      } catch (error) {
        console.error('Error initializing Web5:', error);
      }
    };

    initWeb5();
 
}, []);
  
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
      {myDid}
      </div>
    </main>
  
  );
};

export default MyPage;
