"use client";
import { useContext, useEffect, useState } from "react";
import { ProviderContext } from "@/components/provider";

import ClickAnimation from "../../lib/click-animation";
import HooverAnimation from "../../lib/hoover-animation";
import LoopAnimation from "../../lib/loop-animation";
import ActivateAnimation from "../../lib/activate-animation";

import Trash from "../../public/icons/trash.json";
import Error from "../../public/icons/error.json";
import Refresh from "../../public/icons/refresh.json";
import Checkmark from "../../public/icons/checkmark-white.json";
import CheckmarkBlack from "../../public/icons/checkmark.json";
import Edit from "../../public/icons/edit.json";
import Copy from "../../public/icons/copy.json";
import Eye from "../../public/icons/eye.json";

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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PswDisplay = () => {
  const { myDid, notes, deleteNote, editNote, decrypt } =
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

  const [nameEdit, setNameEdit] = useState(false);
  const [nameModified, setNameModified] = useState<string>();
  const [noteEdit, setNoteEdit] = useState(false);
  const [noteModified, setNoteModified] = useState<string>();

  const submitNotePsw = (id: string) => {
    let name;
    let note;
    console.log("name" + nameModified);
    console.log("note" + noteModified);
    !nameModified
      ? (name = notes!.find((note) => note.id === id)!.data.name)
      : (name = nameModified);
    !noteModified
      ? (note = decrypt!(notes!.find((psw) => psw.id === id)!.data.note, myDid!))
      : (note = noteModified);
    console.log("name" + name);
    console.log("note" + note);
      editNote!(id, name, note);
    toast({
      title: "Note edited",
    });
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
            <TableHead>Name</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes!.map((note) => (
            <Drawer>
              <TableRow key={note.id}>
                <TableCell className="w-[100px] pl-2">
                  <DrawerTrigger asChild>
                    <Button variant="outline">See</Button>
                  </DrawerTrigger>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start items-center">
                    {note.data.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-start items-center">
                    {decrypt!(note.data.note, myDid!)}
                  </div>
                </TableCell>
                <TableCell className=" flex items-center justify-end">
                  <HooverAnimation
                    animationData={Trash}
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      deleteNote!(note.id);
                      toast({
                        variant: "destructive",
                        title: "Note deleted",
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Note Information</DrawerTitle>
                    <DrawerDescription>
                      Set your details for this note.
                    </DrawerDescription>
                  </DrawerHeader>
                  <Card className="m-4 p-4 pb-0">
                    <CardContent className="flex items-left justify-center space-y-4 flex-col">
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Name</Label>
                        <div className="flex items-center justify-center h-10">
                          {!nameEdit ? (
                            <>
                              <div className="w-[80%] truncate">
                                {!nameModified ? note.data.name : nameModified}
                              </div>
                              <HooverAnimation
                                animationData={Edit}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setNameEdit(true);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Input
                                type="text"
                                className="w-[80%]"
                                value={
                                  !nameModified ? note.data.name : nameModified
                                }
                                onChange={(e) => {
                                  setNameModified(e.target.value);
                                }}
                              />
                              <LoopAnimation
                                animationData={Checkmark}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setNameEdit(false);
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label className="text-lg font-bold">Note</Label>
                        <div className="flex items-center justify-center h-10">
                          {!noteEdit ? (
                            <>
                              <div className="w-[80%] truncate">
                                {!noteModified
                                  ? decrypt!(note.data.note, myDid!)
                                  : noteModified}
                              </div>
                              <HooverAnimation
                                animationData={Edit}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setNoteEdit(true);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Input
                                type="text"
                                className="w-[80%]"
                                value={
                                  !noteModified
                                    ? decrypt!(note.data.note, myDid!)
                                    : noteModified
                                }
                                onChange={(e) => {
                                  setNoteModified(e.target.value);
                                }}
                              />
                              <LoopAnimation
                                animationData={Checkmark}
                                className="ml-2 h-6 w-6 cursor-pointer"
                                onClick={() => {
                                  setNoteEdit(false);
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button onClick={() => submitNotePsw(note.id)}>
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
                          setNameModified(undefined);
                          setNoteModified(undefined);
                          setNameEdit(false);
                          setNoteEdit(false);
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
