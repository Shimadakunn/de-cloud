"use client";
import { PswRegister } from '@/public/file/file-register';
import  PswDisplay  from '@/public/file/file-display';

const MyPage = () => {
  return (
    <main className="flex flex-col w-full h-[93vh] p-6">
    <div className="flex justify-between items-center">
      <PswRegister />
    </div>
    <PswDisplay/>
  </main>
  
  );
};

export default MyPage;
