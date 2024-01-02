"use client";
import { PswRegister } from '@/app/note/note-register';
import  PswDisplay  from '@/app/note/note-display';

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
