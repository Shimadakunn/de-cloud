"use client";

import { Web5 } from "@web5/api";
import { createContext, useEffect, useState, useRef } from "react";

interface Psw {
  record: any;
  data: {
    url: string;
    username: string;
    password: string;
  };
  id: string;
}

export const ProviderContext = createContext<{
   web5?: Web5;
    myDid?: string;
    psws?: Psw[];
    addPsw?: (_url:string, _username:string, _password:string) => void;
    deletePsw?: (pswId: string) => void;
    editPsw?: (pswId: string,_url:string, _username:string, _password:string) => void;
  }>({});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [web5, setWeb5] = useState<Web5>();
  const [myDid, setMyDid] = useState<string>('');
  const [psws, setPsws] = useState<Psw[]>([]);

  useEffect(() => {
    const connectWeb5 = async () => {
      const web5Result = await Web5.connect();
      setWeb5(web5Result.web5);
      setMyDid(web5Result.did);

      const { records } = await web5Result.web5.dwn.records.query({
        message: {
          filter: {
            schema: 'http://some-schema-registry.org/p',
          },
        },
      });

      const newPsws = records!.map(async (record) => {
        const data = await record.data.json();
        return { record, data, id: record.id };
      });
      setPsws(await Promise.all(newPsws));
    };

    connectWeb5();
  }, []);

  const addPsw = async (_url:string, _username:string, _password:string) => {
    const pswData = {
      url: _url,
      username: _username,
      password: _password,
    };

    const { record } = await web5!.dwn.records.create({
      data: pswData,
      message: {
        schema: 'http://some-schema-registry.org/p',
        dataFormat: 'application/json',
      },
    });

    const data = await record!.data.json();
    setPsws([...psws, { record, data, id: record!.id }]);
  };

  const deletePsw = async (pswId: string) => {
    setPsws(psws.filter((psw) => psw.id !== pswId));
    await web5!.dwn.records.delete({
      message: {
        recordId: pswId,
      },
    });
  };

  const editPsw = async (pswId: string,_url:string, _username:string, _password:string) => {
    const updatedPsws = psws.map((psw) => {
      if (psw.id === pswId) {
        return {
          ...psw,
          data: {  url: _url,
            username: _username,
            password: _password, },
        };
      }
      return psw;
    });

    setPsws(updatedPsws);

    const { record } = await web5!.dwn.records.read({
      message: {
        filter: {
          recordId: pswId,
        },
      },
    });

    await record.update({ data: {  url: _url,
      username: _username,
      password: _password, } });
  };
    return (
        <ProviderContext.Provider
          value={{
            web5,
            myDid,
            psws,
            addPsw,
            deletePsw,
            editPsw,
          }}
        >
          {children}
        </ProviderContext.Provider>
      );
    }