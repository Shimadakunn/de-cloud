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
    name: string;
    pin: number;
    date: string;
    hash: string;
  };
  id: string;
}

export const ProviderContext = createContext<{
   web5?: Web5;
    myDid?: string;
    psws?: Psw[];
    api?: string;
    gateway?: string;
    notes?: Note[];
    files?: File[];
    addPsw?: (_url:string, _username:string, _password:string) => void;
    addNote?: (_name:string,_note:string) => void;
    addApi?: (_api:string) => void;
    addGateway?: (_gateway:string) => void;
    addFile?: (_name:string,_pin:number,date:string,hash:string) => void;
    deletePsw?: (pswId: string) => void;
    deleteNote?: (noteId: string) => void;
    deleteFile?: (fileId: string) => void;
    editPsw?: (pswId: string,_url:string, _username:string, _password:string) => void;
    editNote?: (noteId: string, _name:string, _note:string) => void;
    editFile?: (fileId: string, _name:string) => void;
    encrypt?: (text: string, keyString: string) => string;
    decrypt?: (encryptedText: string, keyString: string) => string;
  }>({});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [web5, setWeb5] = useState<Web5>();
  const [myDid, setMyDid] = useState<string>('');
  const [psws, setPsws] = useState<Psw[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [api, setApi] = useState<string>();
  const [gateway, setGateway] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);


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
        api:{
          schema: "api",
          dataFormats: [
            "text/plain"
          ]
        },
        gateway:{
          schema: "gateway",
          dataFormats: [
            "text/plain"
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
        "api": {},
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

        const { records: apiRecords } = await web5Result.web5.dwn.records.query({
          message: {
            filter: {
              schema: 'api',
            },
          },
        });

        if (apiRecords && apiRecords.length > 0) {
          const firstRecord = apiRecords[0];
          console.log("api value: "+await firstRecord.data.text());
          setApi( await firstRecord.data.text());
        }

        const { records: gatewayRecords } = await web5Result.web5.dwn.records.query({
          message: {
            filter: {
              schema: 'gateway',
            },
          },
        });

        if (gatewayRecords && gatewayRecords.length > 0) {
          const firstGateway = gatewayRecords[0];
          console.log("gateway value: "+await firstGateway.data.text());
          setGateway( await firstGateway.data.text());
        }

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

        const { records: fileRecords } = await web5Result.web5.dwn.records.query({
          message: {
            filter: {
              schema: 'file',
            },
          },
        });
        const newFiles = fileRecords!.map(async (record) => {
          const data = await record.data.json();
          return { record, data, id: record.id };
        });
        setFiles(await Promise.all(newFiles));
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

  const addApi = async (_api:string) => {
    if(api === undefined){  
      console.log("Api is undefined");
      const enc_api = encrypt!(_api, myDid!);
      const { record } = await web5!.dwn.records.create({
        data: enc_api,
        message: {
          schema: 'api',
          dataFormat: "text/plain",
        },
      });
      const data = await record!.data.text();
      setApi(data);
    }else{
      console.log("Api is defined");
      const { record } = await web5!.dwn.records.read({
        message: {
          filter: {
            schema: 'api',
          },
        },
      });
      await record.update({ data: encrypt!(_api, myDid!) });
      setApi(_api);
    }
  };

  const addGateway = async (_gateway:string) => {
    if(gateway === undefined){  
      console.log("Gateway is undefined");
      const enc_gateway = encrypt!(_gateway, myDid!);
      const { record } = await web5!.dwn.records.create({
        data: enc_gateway,
        message: {
          schema: 'gateway',
          dataFormat: "text/plain",
        },
      });
      const data = await record!.data.text();
      setGateway(data);
    }else{
      console.log("Provider is defined");
      const { record } = await web5!.dwn.records.read({
        message: {
          filter: {
            schema: 'gateway',
          },
        },
      });
      await record.update({ data: encrypt!(_gateway, myDid!) });
      setGateway(_gateway);
    }
  }

  const addFile = async (_name:string,_pin:number,date:string,hash:string) => {
    const fileData = {
      name: _name,
      pin: _pin,
      date: date,
      hash: encrypt!(hash, myDid!)
    };

    const { record } = await web5!.dwn.records.create({
      data: fileData,
      message: {
        schema: 'file',
        dataFormat: "application/json",
      },
    });

    const data = await record!.data.json();
    setFiles([...files, { record, data, id: record!.id }]);
  }

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

  const deleteFile = async (fileId: string) => {
    setFiles(files.filter((file) => file.id !== fileId));
    const cid = files.filter((file) => file.id === fileId)[0].data.pin;
    await web5!.dwn.records.delete({
      message: {
        recordId: fileId,
      },
    });

    const url = 'https://api.pinata.cloud/pinning/unpin/';
    const options = {
      method: 'DELETE',
      headers: { 'accept': 'application/json' }
    };

    fetch(url+cid, options)
    .then((res: Response)=> {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data:any) => {
      console.log(data);
    })
    .catch((err:Error) => {
      console.error('Error:', err);
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

  const editFile = async (fileId: string,_name:string) => {
    let data;
    const updatedFiles = files.map((file) => {
      if (file.id === fileId) {
        data = file.data;
        return {
          ...file,
          data: {  name:_name,pin:file.data.pin,date: file.data.date,hash: file.data.hash }
        };
      }
      return file;
    });

    setFiles(updatedFiles);

    const { record } = await web5!.dwn.records.read({
      message: {
        filter: {
          recordId: fileId,
        },
      },
    });

    await record.update({ data:data });
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
            api,
            gateway,
            files,
            addPsw,
            addNote,
            addApi,
            addGateway,
            addFile,
            deletePsw,
            deleteNote,
            deleteFile,
            editPsw,
            editNote,
            editFile,
            encrypt,
            decrypt
          }}
        >
          {children}
        </ProviderContext.Provider>
      );
    }