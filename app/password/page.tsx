"use client";
import { PswRegister } from '@/app/password/psw-register';
import  PswDisplay  from '@/app/password/psw-display';

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
