"use client";
import { useRouter } from "next/navigation";
import Scrumble from "@/components/ui/scrumble-text/scrumble";
import { Button } from "@/components/ui/button";

const MyPage = () => {
  const router = useRouter();
  
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
      </div>
    </main>
  
  );
};

export default MyPage;
