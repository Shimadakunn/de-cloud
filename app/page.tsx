import { PswRegister } from '@/components/psw-register';
import  PswDisplay  from '@/components/psw-display';


const MyPage = () => {
  return (
    <main className="flex flex-col w-full h-[93vh] border border-red-500 p-6">
    <div className="border border-red-500">
      <PswRegister />
    </div>
    <PswDisplay/>
  </main>
  
  );
};

export default MyPage;
