"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

import ActivateAnimation from "../lib/activate-animation";

import Menu from "../public/icons/menu.json";

import { Lock, Paperclip, StickyNote, Wallet } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      {pathname !== "/" && (
        <header
          className={`bg-slate-800 h-screen flex flex-col space-y-20 justify-start items-left transition-all duration-300 ease-in-out py-6 ${
            open ? "w-[20vw]" : "w-16"
          }`}
        >
          <ActivateAnimation
            animationData={Menu}
            className="ml-4 h-8 w-8 cursor-pointer"
            activate={true}
            onClick={() => {
              setOpen(!open);
            }}
          />
          <div
            className="relative flex cursor-pointer"
            onClick={() => {
              router.push("/password");
            }}
          >
            <Lock className="ml-5 h-6 w-6" />
            <div
              className={`absolute ml-14 transition-all duration-300 ease-in-out ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              Passwords
            </div>
          </div>
          <div
            className="relative flex cursor-pointer"
            onClick={() => {
              router.push("/note");
            }}
          >
            <StickyNote className="ml-5 h-6 w-6" />
            <div
              className={`absolute ml-14 transition-all duration-300 ease-in-out ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              Notes
            </div>
          </div>
          <div
            className="relative flex cursor-pointer"
            onClick={() => {
              router.push("/file");
            }}
          >
            <Paperclip className="ml-5 h-6 w-6" />
            <div
              className={`absolute ml-14 transition-all duration-300 ease-in-out ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              Files
            </div>
          </div>
          <div
            className="relative flex cursor-pointer"
            onClick={() => {
              router.push("/wallet");
            }}
          >
            <Wallet className="ml-5 h-6 w-6" />
            <div
              className={`absolute ml-14 transition-all duration-300 ease-in-out ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              Wallet
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
