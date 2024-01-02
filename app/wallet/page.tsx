"use client";
import { PswRegister } from '@/app/wallet/wallet-register';
import  PswDisplay  from '@/app/wallet/wallet-display';

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
