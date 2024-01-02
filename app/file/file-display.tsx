"use client";
import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";

import HooverAnimation from "../../lib/hoover-animation";

import Trash from "../../public/icons/trash.json";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const PswDisplay = () => {
  const { myDid, gateway, files, deleteFile, decrypt } =
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

  function formatDate(dateString:string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="flex-grow">
      <Table>
        {/* <TableCaption>
          {!myDid && (
            <div className="h-[60vh] flex items-center justify-center">
              <Progress value={number} className="w-[60%]" />
            </div>
          )}
          All your files
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left">Open</TableHead>
            <TableHead className="w-[10vw]">Name</TableHead>
            <TableHead>Pin</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {files!.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="w-[100px] pl-2">
                  <Button variant="secondary"
                    onClick={() => {
                      window.open("https://"+decrypt!(gateway!,myDid!)+"/ipfs/"+decrypt!(file.data.hash!,myDid!), "_blank");
                      toast({
                        title: "If there is a problem with the link, try to refresh the page or check the validity of your gateway and your JWT token.",
                      });
                    }}
                  >See</Button>
                </TableCell>
                <TableCell className="">
                  <div className="flex justify-start items-center">
                    {file.data.name}
                  </div>
                </TableCell>
                <TableCell className="">
                    {file.data.pin}
                </TableCell>
                <TableCell className="">
                  {formatDate(file.data.date)}
                </TableCell>
                <TableCell className=" flex items-center justify-end">
                  <HooverAnimation
                    animationData={Trash}
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      deleteFile!(file.id);
                      toast({
                        variant: "destructive",
                        title: "File deleted",
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PswDisplay;
