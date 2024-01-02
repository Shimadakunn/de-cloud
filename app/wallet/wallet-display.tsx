"use client";
import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";

import HooverAnimation from "../../lib/hoover-animation";
import LoopAnimation from "../../lib/loop-animation";
import ActivateAnimation from "../../lib/activate-animation";

import Trash from "../../public/icons/trash.json";
import CheckmarkBlack from "../../public/icons/checkmark.json";
import Copy from "../../public/icons/copy.json";
import Eye from "../../public/icons/eye.json";

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

const PswDisplay = () => {
  const { myDid, wallets, deleteWallet, decrypt } = useContext(ProviderContext);

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

  const [pkVisible, setPkVisible] = useState(false);
  const [seedVisible, setSeedVisible] = useState(false);

  const hidePassword = (psw: string) => {
    return psw.replace(/./g, "*");
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
          All your wallets
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left">Open</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Public Key</TableHead>
            <TableHead>Claim VC</TableHead>
            <TableHead>Send</TableHead>
            <TableHead>Sign</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets!.map((wallet) => (
            <Drawer>
              <TableRow key={wallet.id}>
                <TableCell className="w-[100px] pl-2">
                  <DrawerTrigger asChild>
                    <Button variant="secondary">See</Button>
                  </DrawerTrigger>
                </TableCell>
                <TableCell className="w-[10vw]">
                  <div className="flex justify-start items-center">
                    {wallet.data.name}
                  </div>
                </TableCell>
                <TableCell className="w-[20vw]">
                  <div className="flex justify-start items-center">
                    <div  className="w-[25vw] truncate">
                      {wallet.data.pbk}
                    </div>
                    <HooverAnimation
                      animationData={Copy}
                      className="ml-2 h-6 w-6 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(wallet.data.pbk);
                        toast({
                          title: "Copied username to clipboard",
                        });
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="w-[15vw]">
                  <Button variant="secondary"
                  onClick={() => {
                    toast({
                      title: "Possibility to claim VC in the future with the wallet.",
                    });
                  }}>
                    Claim VC
                  </Button>
                </TableCell>
                <TableCell className="w-[15vw]">
                  <Button variant="secondary"
                  onClick={() => {
                    toast({
                      title: "Possibility to send funds in the future with the wallet.",
                    });
                  }}>
                    Send
                  </Button>
                </TableCell>
                <TableCell className="w-[15vw]">
                  <Button variant="secondary"
                  onClick={() => {
                    toast({
                      title: "Possibility to sign in the future with the wallet.",
                    });
                  }}>
                    Sign
                  </Button>
                </TableCell>
                <TableCell className=" flex items-center justify-end">
                  <HooverAnimation
                    animationData={Trash}
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      deleteWallet!(wallet.id);
                      toast({
                        variant: "destructive",
                        title: "Wallet deleted",
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Wallet Information</DrawerTitle>
                    <DrawerDescription>
                      Set your details for this wallet.
                    </DrawerDescription>
                  </DrawerHeader>
                  <Card className="m-4 p-4 pb-0">
                    <CardContent className="flex items-left justify-center space-y-4 flex-col">
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Wallet Name</Label>
                        <div className="w-[80%] truncate flex items-center justify-start">
                          {wallet.data.name}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Public Key</Label>
                        <div className="flex items-center justify-center h-10">
                          <div className="w-full truncate flex items-center justify-start">
                            {wallet.data.pbk}
                          </div>
                          <HooverAnimation
                            animationData={Copy}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(wallet.data.pbk);
                              toast({
                                title: "Copied public key to clipboard",
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Private Key</Label>
                        <div className="flex items-center justify-center h-10">
                          <div className="w-[80%] truncate flex items-center justify-start">
                            {!pkVisible
                              ? hidePassword(decrypt!(wallet.data.pk, myDid!))
                              : decrypt!(wallet.data.pk, myDid!)}
                          </div>
                          <ActivateAnimation
                            animationData={Eye}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={() => {
                              setPkVisible(!pkVisible);
                            }}
                          />
                          <HooverAnimation
                            animationData={Copy}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                decrypt!(wallet.data.pk, myDid!)
                              );
                              toast({
                                title: "Copied private key to clipboard",
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Seed Phrase</Label>
                        <div className="flex items-center justify-center h-10">
                          <div className="w-[80%] truncate flex items-center justify-start">
                            {!seedVisible
                              ? hidePassword(decrypt!(wallet.data.seed, myDid!))
                              : decrypt!(wallet.data.seed, myDid!)}
                          </div>
                          <ActivateAnimation
                            animationData={Eye}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={() => {
                              setSeedVisible(!seedVisible);
                            }}
                          />
                          <HooverAnimation
                            animationData={Copy}
                            className="ml-2 h-6 w-6 cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                decrypt!(wallet.data.seed, myDid!)
                              );
                              toast({
                                title: "Copied see phrase to clipboard",
                              });
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button
                        onClick={() => {
                          setSeedVisible(false);
                          setPkVisible(false);
                        }}
                      >
                        <LoopAnimation
                          animationData={CheckmarkBlack}
                          className="ml-2 h-6 w-6 cursor-pointer"
                        />
                        Close
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
