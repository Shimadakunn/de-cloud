"use client";
import { PswRegister } from '@/components/psw-register';
import  PswDisplay  from '@/components/psw-display';

import { use, useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";

const MyPage = () => {
  const { myDid, psws, encrypt,decrypt } =
    useContext(ProviderContext);

    const [encryptedText, setEncryptedText] = useState<string>('');
    const [decryptedText, setDecryptedText] = useState<string>('');

    const encryptText = () => {
      if(myDid){
        setEncryptedText(encrypt!('test', myDid));
      }
    };

    const decryptText = () => {
      if(myDid){
        setDecryptedText(decrypt!(encryptedText, myDid));
      }
    }

    useEffect(() => {
      encryptText();
    }, [myDid]);

  return (
    <main className="flex flex-col w-full h-[93vh] p-6">
    <div className="">
      <PswRegister />
    </div>
    <PswDisplay/>

    encrypted: {encryptedText}
    <button onClick={() => decryptText()}>
      decrypt
    </button>
    decrypted: {decryptedText}

  </main>
  
  );
};

export default MyPage;
