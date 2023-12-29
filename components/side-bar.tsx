"use client";
import { useState } from "react";

import { Separator } from "@/components/ui/separator";

import ActivateAnimation from "../lib/activate-animation";

import Menu from "../public/icons/menu.json";

import { Lock, FileLock, Wallet } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={`bg-slate-800 h-screen flex flex-col space-y-10 justify-start items-left transition-all duration-300 ease-in-out py-8 ${
        open ? "w-[20vw]" : "w-10"
      }`}
    >
      <ActivateAnimation
        animationData={Menu}
        className="ml-1 h-8 w-8 cursor-pointer"
        activate={true}
        onClick={() => {
          setOpen(!open);
        }}
      />
      <div className="relative flex">
        <Lock className="ml-2 h-6 w-6 cursor-pointer" />
        <div
          className={`absolute ml-12 transition-all duration-300 ease-in-out ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          hello
        </div>
      </div>
      <div className="relative flex">
        <FileLock className="ml-2 h-6 w-6 cursor-pointer" />
        <div
          className={`absolute ml-12 transition-all duration-300 ease-in-out ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          hello
        </div>
      </div>
      <div className="relative flex">
        <Wallet className="ml-2 h-6 w-6 cursor-pointer" />
        <div
          className={`absolute ml-12 transition-all duration-300 ease-in-out ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          hello
        </div>
      </div>
    </header>
  );
};

export default Header;
