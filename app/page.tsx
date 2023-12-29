"use client";
import { PswRegister } from '@/components/psw-register';
import  PswDisplay  from '@/components/psw-display';

import { use, useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";

const MyPage = () => {
  return (
    <main className="flex flex-col w-full h-[93vh] p-6">
    <div className="">
      <PswRegister />
    </div>
    <PswDisplay/>
  </main>
  
  );
};

export default MyPage;
