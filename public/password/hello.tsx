"use client";
import { PswRegister } from '@/public/password/psw-register';
import  PswDisplay  from '@/public/password/psw-display';

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
