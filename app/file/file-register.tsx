"use client";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import HooverAnimation from "../../lib/hoover-animation";
import LoopAnimation from "../../lib/loop-animation";
import ClickAnimation from "../../lib/click-animation";

import Edit from "../../public/icons/edit.json";
import Checkmark from "../../public/icons/checkmark-white.json";
import Refresh from "../../public/icons/refresh.json";
import Error from "../../public/icons/error.json";
import Copy from "../../public/icons/copy.json";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon, CheckIcon } from "@radix-ui/react-icons";
import { toast } from "@/components/ui/use-toast";

import { ProviderContext } from "@/components/provider";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  file: z.instanceof(File).optional(),
});

export function PswRegister() {
  const { myDid, api, addApi, decrypt, addFile } = useContext(ProviderContext);

  const [apiEdit, setApiEdit] = useState(false);
  const [apiModified, setApiModified] = useState<string>();

  useEffect(() => {
    setApiEdit(api === undefined);
  }, [api]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(apiModified ?? decrypt!(api!, myDid!));
    const formData = new FormData();
    if (!data.file) {
      toast({
        variant: "destructive",
        title: "Note deleted",
      });
      return;
    }
    console.log("File Name: " + data.file!.name);

    formData.append("file", data.file);
    const pinataMetadata = JSON.stringify({
      name: data.name,
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    console.log("Form Data: " + formData);
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            Authorization: `Bearer ${apiModified ?? decrypt!(api!, myDid!)}`,
          },
        }
      );
      addFile!(data.name,response.data.PinSize,response.data.Timestamp,response.data.IpfsHash);
      toast({
        title: "Your file was successfully uploaded!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 flex justify-center items-start flex-col space-y-2">
            <div>
              <span className="font-extrabold">Name:</span> {data.name}
            </div>
            <div>
              <span className="font-extrabold">Time:</span> {response.data.Timestamp}
            </div>
          </pre>
        ),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "API key is invalid",
      });
      console.error(error);
    }
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Enter your note</AlertDialogTitle>
                <AlertDialogDescription>
                  Input your infromations
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid space-y-4 mt-4 mb-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Add a name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            form.setValue("file", file);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="pl-2">
                  <LoopAnimation
                    animationData={Error}
                    className="mr-1 h-6 w-6"
                  />
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit" className="pl-2">
                  <LoopAnimation
                    animationData={Checkmark}
                    className="mr-1 h-6 w-6"
                  />
                  Save changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center justify-center h-10">
        {myDid &&
          (!apiEdit ? (
            <>
              <div className="w-48 truncate">
                <span className="text-gray-500 mr-1">Pinata API: </span>
                {apiModified ?? decrypt!(api!, myDid)}
              </div>
              <HooverAnimation
                animationData={Edit}
                className="ml-2 h-6 w-6 cursor-pointer"
                onClick={() => setApiEdit(true)}
              />
            </>
          ) : (
            <>
              <Input
                type="text"
                className="w-[80%]"
                placeholder="Api key"
                onChange={(e) => setApiModified(e.target.value)}
              />
              <LoopAnimation
                animationData={Checkmark}
                className="ml-2 h-6 w-6 cursor-pointer"
                onClick={() => {
                  if (!apiModified) {
                    toast({
                      variant: "destructive",
                      title: "Api key must be filled",
                    });
                  } else {
                    addApi!(apiModified);
                    toast({
                      title: "Api key updated",
                    });
                    setApiEdit(false);
                  }
                }}
              />
              <LoopAnimation
                animationData={Error}
                className="mr-1 h-6 w-6 cursor-pointer"
                onClick={() => setApiEdit(false)}
              />
            </>
          ))}
      </div>
    </>
  );
}
