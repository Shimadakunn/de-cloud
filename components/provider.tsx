"use client";

import { Web5 } from "@web5/api";
import { createContext, useEffect, useState, useRef } from "react";

import crypto from 'crypto';

interface Psw {
  record: any;
  data: {
    url: string;
    username: string;
    password: string;
  };
  id: string;
}

interface Note {
  record: any;
  data: {
    name: string;
    note: string;
  };
  id: string;
}

interface File {
  record: any;
  data: {
    file: string;
  };
  id: string;
}

export const ProviderContext = createContext<{
   web5?: Web5;
    myDid?: string;
    psws?: Psw[];
    notes?: Note[];
    addPsw?: (_url:string, _username:string, _password:string) => void;
    addNote?: (_name:string,_note:string) => void;
    deletePsw?: (pswId: string) => void;
    deleteNote?: (noteId: string) => void;
    editPsw?: (pswId: string,_url:string, _username:string, _password:string) => void;
    editNote?: (noteId: string, _name:string, _note:string) => void;
    encrypt?: (text: string, keyString: string) => string;
    decrypt?: (encryptedText: string, keyString: string) => string;
  }>({});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [web5, setWeb5] = useState<Web5>();
  const [myDid, setMyDid] = useState<string>('');
  const [psws, setPsws] = useState<Psw[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);


  const createProtocolDefinition = () => {
    const dingerProtocolDefinition = {
      protocol: "http://private-protocol.xyz",
      published: false,
      types: {
        password: {
          schema: "password",
          dataFormats: [
            "application/json"
          ]
        },
        note: {
          schema: "note",
          dataFormats: [
            "application/json"
          ]
        },
        file: {
          schema: "file",
          dataFormats: [
            "application/json"
          ]
        },
        wallet: {
          schema: "wallet",
          dataFormats: [
            "application/json"
          ]
        }
      },
      structure: {
        "password": {},
        "note": {},
        "file": {},
        "wallet": {}
      }
    }
    return dingerProtocolDefinition;
  };

  const queryForProtocol = async (web5:any) => {
    return await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: "http://private-protocol.xyz",
        },
      },
    });
  };

  const installProtocolLocally = async (web5:any, protocolDefinition:any) => {
    return await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });
  };

  const configureProtocol = async (web5:any, did:any) => {
    const protocolDefinition = await createProtocolDefinition();

    const { protocols: localProtocol, status: localProtocolStatus } =
      await queryForProtocol(web5);
    console.log({ localProtocol, localProtocolStatus });
    if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {

      const { protocol, status } = await installProtocolLocally(web5, protocolDefinition);
      console.log("Protocol installed locally", protocol, status);

      const { status: configureRemoteStatus } = await protocol.send(did);
      console.log("Did the protocol install on the remote DWN?", configureRemoteStatus);
    } else {
      console.log("Protocol already installed");
    }
  };

  useEffect(() => {
    const connectWeb5 = async () => {
      const web5Result = await Web5.connect();
      setWeb5(web5Result.web5);
      setMyDid(web5Result.did);

      if (web5Result.web5 && web5Result.did) {
        await configureProtocol(web5Result.web5, web5Result.did);
        
        const { records } = await web5Result.web5.dwn.records.query({
          message: {
            filter: {
              schema: 'password',
            },
          },
        });
        const newPsws = records!.map(async (record) => {
          const data = await record.data.json();
          return { record, data, id: record.id };
        });
        setPsws(await Promise.all(newPsws));

        const { records: noteRecords } = await web5Result.web5.dwn.records.query({
          message: {
            filter: {
              schema: 'note',
            },
          },
        });
        const newNotes = noteRecords!.map(async (record) => {
          const data = await record.data.json();
          return { record, data, id: record.id };
        });
        setNotes(await Promise.all(newNotes));
      }
    };

    connectWeb5();
  }, []);

  const addPsw = async (_url:string, _username:string, _password:string) => {
    const pswData = {
      url: _url,
      username: _username,
      password: encrypt!(_password, myDid!)
    };

    const { record } = await web5!.dwn.records.create({
      data: pswData,
      message: {
        schema: 'password',
        dataFormat: 'application/json',
      },
    });

    const data = await record!.data.json();
    setPsws([...psws, { record, data, id: record!.id }]);
  };

  const addNote = async (_name:string,_note:string) => {
    const noteData = {
      name: _name,
      note: encrypt!(_note, myDid!)
    };

    const { record } = await web5!.dwn.records.create({
      data: noteData,
      message: {
        schema: 'note',
        dataFormat: "application/json",
      },
    });

    const data = await record!.data.json();
    setNotes([...notes, { record, data, id: record!.id }]);
  };

  const deletePsw = async (pswId: string) => {
    setPsws(psws.filter((psw) => psw.id !== pswId));
    await web5!.dwn.records.delete({
      message: {
        recordId: pswId,
      },
    });
  };

  const deleteNote = async (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    await web5!.dwn.records.delete({
      message: {
        recordId: noteId,
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
            password: encrypt!(_password, myDid!) }
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
      password: encrypt!(_password, myDid!), } });
  };

  const editNote = async (noteId: string,_name:string, _note:string) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === noteId) {
        return {
          ...note,
          data: {  name:_name,note: encrypt!(_note, myDid!) }
        };
      }
      return note;
    });

    setNotes(updatedNotes);

    const { record } = await web5!.dwn.records.read({
      message: {
        filter: {
          recordId: noteId,
        },
      },
    });

    await record.update({ data:{   name:_name,note: encrypt!(_note, myDid!) } });
  };



  function generateKeyFromString(str: string): Buffer {
      return crypto.createHash('sha256').update(str).digest();
  }

  function encrypt(text: string, keyString: string): string {
      const key = generateKeyFromString(keyString);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
      const encryptedWithIv = Buffer.concat([iv, encrypted]);
      return encryptedWithIv.toString('base64');
  }

  function decrypt(encryptedText: string, keyString: string): string {
      const key = generateKeyFromString(keyString);
      const encryptedWithIv = Buffer.from(encryptedText, 'base64');
      const iv = encryptedWithIv.subarray(0, 16);
      const encrypted = encryptedWithIv.subarray(16);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      return decrypted.toString('utf8');
  }

    return (
        <ProviderContext.Provider
          value={{
            web5,
            myDid,
            psws,
            notes,
            addPsw,
            addNote,
            deletePsw,
            deleteNote,
            editPsw,
            editNote,
            encrypt,
            decrypt
          }}
        >
          {children}
        </ProviderContext.Provider>
      );
    }