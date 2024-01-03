"use client";
import { useRouter } from "next/navigation";
import Scrumble from "@/components/ui/scrumble-text/scrumble";

import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MyPage = () => {
  const router = useRouter();

  const { setDwnLink } = useContext(ProviderContext);

  const [dwnModified, setDwnModified] = useState("");

  return (
    <main className="bg-[url('../public/background.png')] bg-cover flex items-center justify-center w-screen h-screen space-y-4">
      <div className="w-full h-full flex flex-col items-left justify-center p-32">
        <div className="text-8xl font-[SFPro] font-semibold">De-Cloud</div>
        <div className="text-3xl mt-12 mb-12">
          <Scrumble />
        </div>
        <div className="flex items-center justify-start space-x-4">
          <Input
            type="text"
            className="w-[12rem]"
            placeholder="DWN Link"
            onChange={(e) => setDwnModified(e.target.value)}
          />
          <Button
            className="w-32"
            disabled={dwnModified === ""}
            onClick={() => {
              setDwnLink!(dwnModified);
              router.push("/password");
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
      <div className="w-full"></div>
    </main>
  );
};

export default MyPage;
