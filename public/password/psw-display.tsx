"use client";
import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";

import ClickAnimation from "../../lib/click-animation";
import HooverAnimation from "../../lib/hoover-animation";
import LoopAnimation from "../../lib/loop-animation";
import ActivateAnimation from "../../lib/activate-animation";

import Trash from "../icons/trash.json";
import Error from "../icons/error.json";
import Refresh from "../icons/refresh.json";
import Checkmark from "../icons/checkmark-white.json";
import CheckmarkBlack from "../icons/checkmark.json";
import Edit from "../icons/edit.json";
import Copy from "../icons/copy.json";
import Eye from "../icons/eye.json";

import { ExternalLink } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PswDisplay = () => {
  const { myDid, psws, deletePsw, editPsw , decrypt } =
    useContext(ProviderContext);

  const [number, setNumber] = useState(0);
  function easeInOutCubic(t: number): number {
    t = t * 1.5;
    if (t > 1) t = 1;
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  useEffect(() => {
    if (!myDid) {
      let start: number | null = null;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const easedValue = easeInOutCubic(progress / 1000) * 100;
        setNumber(Math.min(easedValue, 100));
        if (progress < 1000) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    } else {
      setNumber(0);
    }
  }, [myDid]);

  const [urlEdit, setUrlEdit] = useState(false);
  const [urlModified, setUrlModified] = useState<string>();
  const [usernameEdit, setUsernameEdit] = useState(false);
  const [usernameModified, setUsernameModified] = useState<string>();
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [passwordModified, setPasswordModified] = useState<string>();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [randomString, setRandomString] = useState("");
  const generateRandomString = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const changeRandomCharacter = (str: string) => {
    const index = Math.floor(Math.random() * str.length);
    const newChar = generateRandomString(1);
    return str.substring(0, index) + newChar + str.substring(index + 1);
  };
  const randAnimation = () => {
    setRandomString(generateRandomString(10));
    const interval = setInterval(() => {
      setRandomString((prevString) => changeRandomCharacter(prevString));
      setRandomString((prevString) => changeRandomCharacter(prevString));
    }, 50);

    setTimeout(() => clearInterval(interval), 1000);
  };

  const hidePassword = (psw: string) => {
    return psw.replace(/./g, "*");
  };
  const submitEditPsw = (id: string) => {
    let url;
    let username;
    let password;
    !urlModified
      ? (url = psws!.find((psw) => psw.id === id)!.data.url)
      : (url = urlModified);
    !usernameModified
      ? (username = psws!.find((psw) => psw.id === id)!.data.username)
      : (username = usernameModified);
    !passwordModified
      ? (password = decrypt!(psws!.find((psw) => psw.id === id)!.data.password,myDid!))
      : (password = passwordModified);
    editPsw!(id, url, username, password);
    toast({
      title: "Password edited",
    });
  };

  const initialVisibility = psws!.reduce((acc, psw) => {
    acc[psw.id] = false;
    return acc;
  }, {} as Record<string, boolean>);
  const [visibility, setVisibility] = useState(initialVisibility);
  const toggleVisibility = (id: string) => {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-grow">
      <Table>
        <TableCaption>
          {!myDid && (
            <div className="h-[60vh] flex items-center justify-center">
              <Progress value={number} className="w-[60%]" />
            </div>
          )}
          All your passwords
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left">Open</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Password</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {psws!.map((psw) => (
            <Drawer key={psw.id}>
              <TableRow>
                <TableCell className="w-[100px] pl-2">
                  <DrawerTrigger asChild>
                    <Button variant="secondary">See</Button>
                  </DrawerTrigger>
                </TableCell>
                <TableCell className="w-[20vw]">
                  <div className="flex justify-start items-center">
                    {psw.data.url}
                    <ExternalLink
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={() => window.open(psw.data.url, "_blank")}
                    />
                  </div>
                </TableCell>
                <TableCell className="w-[25vw]">
                  <div className="flex justify-start items-center">
                    {psw.data.username}
                    <HooverAnimation
                      animationData={Copy}
                      className="ml-2 h-6 w-6 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(psw.data.username);
                        toast({
                          title: "Copied username to clipboard",
                        });
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start items-center">
                    {!visibility[psw.id] ? (
                      <span className="mx-2 pt-2">
                        {hidePassword(decrypt!(psw.data.password, myDid!))}
                      </span>
                    ) : (
                      decrypt!(psw.data.password, myDid!)
                    )}
                    <ActivateAnimation
                      animationData={Eye}
                      className="ml-2 h-6 w-6 cursor-pointer"
                      onClick={() => {
                        toggleVisibility(psw.id);
                      }}
                    />
                    <HooverAnimation
                      animationData={Copy}
                      className="ml-2 h-6 w-6 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          decrypt!(psw.data.password, myDid!)
                        );
                        toast({
                          title: "Copied password to clipboard",
                        });
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className=" flex items-center justify-end">
                  <HooverAnimation
                    animationData={Trash}
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      deletePsw!(psw.id);
                      toast({
                        variant: "destructive",
                        title: "Password deleted",
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Password Information</DrawerTitle>
                    <DrawerDescription>
                      Set your details for this password.
                    </DrawerDescription>
                  </DrawerHeader>
                  <Card className="m-4 p-4 pb-0">
                    <CardContent className="flex items-left justify-center space-y-4 flex-col">
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Website URL</Label>
                        <div className="flex items-center justify-center h-10">
                          {!urlEdit ? (
                            <>
                              <div className="w-[80%] truncate">
                                {!urlModified ? psw.data.url : urlModified}
                              </div>
                              <HooverAnimation
                                animationData={Edit}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setUrlEdit(true);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Input
                                type="text"
                                className="w-[80%]"
                                value={
                                  !urlModified ? psw.data.url : urlModified
                                }
                                onChange={(e) => {
                                  setUrlModified(e.target.value);
                                }}
                              />
                              <LoopAnimation
                                animationData={Checkmark}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setUrlEdit(false);
                                }}
                              />
                            </>
                          )}
                          <HooverAnimation
                            animationData={Copy}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={() => {
                              !passwordModified
                                ? navigator.clipboard.writeText(
                                    decrypt!(psw.data.password, myDid!)
                                  )
                                : navigator.clipboard.writeText(
                                    passwordModified
                                  );
                              toast({
                                title: "Copied url to clipboard",
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Identifier</Label>
                        <div className="flex items-center justify-center h-10">
                          {!usernameEdit ? (
                            <>
                              <div className="w-[80%] truncate">
                                {!usernameModified
                                  ? psw.data.username
                                  : usernameModified}
                              </div>
                              <HooverAnimation
                                animationData={Edit}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setUsernameEdit(true);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Input
                                type="text"
                                className="w-[80%]"
                                value={
                                  !usernameModified
                                    ? psw.data.username
                                    : usernameModified
                                }
                                onChange={(e) => {
                                  setUsernameModified(e.target.value);
                                }}
                              />
                              <LoopAnimation
                                animationData={Checkmark}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setUsernameEdit(false);
                                }}
                              />
                            </>
                          )}
                          <HooverAnimation
                            animationData={Copy}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={() => {
                              !passwordModified
                                ? navigator.clipboard.writeText(
                                    decrypt!(psw.data.password, myDid!)
                                  )
                                : navigator.clipboard.writeText(
                                    passwordModified
                                  );
                              toast({
                                title: "Copied identifier to clipboard",
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Password</Label>
                        <div className="flex items-center justify-center h-10">
                          {!passwordEdit ? (
                            <>
                              <div className="w-[80%] truncate flex items-center justify-start">
                                {!passwordVisible
                                  ? hidePassword(
                                      decrypt!(psw.data.password, myDid!)
                                    )
                                  : !passwordModified && passwordVisible
                                  ? decrypt!(psw.data.password, myDid!)
                                  : passwordModified}
                              </div>
                              <ActivateAnimation
                                animationData={Eye}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setPasswordVisible(!passwordVisible);
                                }}
                              />
                              <HooverAnimation
                                animationData={Edit}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setPasswordEdit(true);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Input
                                type="text"
                                className="w-[80%]"
                                value={
                                  !passwordModified
                                    ? decrypt!(psw.data.password, myDid!)
                                    : passwordModified
                                }
                                onChange={(e) => {
                                  setPasswordModified(e.target.value);
                                }}
                              />
                              <ActivateAnimation
                                animationData={Eye}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setPasswordVisible(!passwordVisible);
                                }}
                              />
                              <LoopAnimation
                                animationData={Checkmark}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setPasswordEdit(false);
                                }}
                              />
                            </>
                          )}
                          <HooverAnimation
                            animationData={Copy}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={() => {
                              !passwordModified
                                ? navigator.clipboard.writeText(
                                    decrypt!(psw.data.password, myDid!)
                                  )
                                : navigator.clipboard.writeText(
                                    passwordModified
                                  );
                              toast({
                                title: "Copied password to clipboard",
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold text-slate-400">
                          Generate
                        </Label>
                        <div className="flex items-center justify-center h-10">
                          <div className="flex-grow flex justify-start items-center">
                            {randomString && (
                              <>
                                <div className="flex-grow text-slate-400">
                                  {randomString}
                                </div>
                                <HooverAnimation
                                  animationData={Copy}
                                  className="ml-2 h-6 w-6 cursor-pointer"
                                  onClick={() => {
                                    navigator.clipboard.writeText(randomString);
                                    toast({
                                      title: "Copied to clipboard",
                                    });
                                  }}
                                />
                              </>
                            )}
                          </div>
                          <ClickAnimation
                            animationData={Refresh}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={randAnimation}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button onClick={() => submitEditPsw(psw.id)}>
                        <LoopAnimation
                          animationData={CheckmarkBlack}
                          className="ml-2 h-6 w-6 cursor-pointer"
                        />
                        Submit
                      </Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUrlModified(undefined);
                          setUsernameModified(undefined);
                          setPasswordModified(undefined);
                          setPasswordVisible(false);
                          setUrlEdit(false);
                          setUsernameEdit(false);
                          setPasswordEdit(false);
                        }}
                      >
                        <LoopAnimation
                          animationData={Error}
                          className="mr-1 h-6 w-6"
                        />
                        Cancel
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PswDisplay;
