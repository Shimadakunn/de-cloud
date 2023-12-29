"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const MyPage = () => {
  const router = useRouter();
  return (
    <main className="flex items-center justify-center w-screen h-screen flex-col space-y-4">
      <div>
        De-Cloud
      </div>
      <div>
        Your decentralized cloud storage
      </div>
      <Button onClick={() => {
              router.push("/password");
            }}>
        Get Started
      </Button>
    </main>
  
  );
};

export default MyPage;
