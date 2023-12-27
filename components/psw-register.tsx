"use client";
import { useState, useContext } from "react";
import HooverAnimation from "../lib/hoover-animation";
import LoopAnimation from "../lib/loop-animation";
import ClickAnimation from "../lib/click-animation";

import Checkmark from "../public/icons/checkmark.json";
import Refresh from "../public/icons/refresh.json";
import Error from "../public/icons/error.json";
import Copy from "../public/icons/copy.json";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon, CheckIcon } from "@radix-ui/react-icons";
import { toast } from "@/components/ui/use-toast";

import { ProviderContext } from "@/components/provider";

const FormSchema = z.object({
  website: z.string().url({ message: "Invalid website URL" }),
  username: z.string().min(2, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export function PswRegister() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addPsw?.(data.website, data.username, data.password);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 flex justify-center items-start flex-col space-y-2">
          <div>
            <span className="font-extrabold">Website:</span> {data.website}
          </div>
          <div>
            <span className="font-extrabold">Username:</span> {data.username}
          </div>
          <div>
            <span className="font-extrabold">Password:</span> {data.password}
          </div>
        </pre>
      ),
    });
  }
  const [randomString, setRandomString] = useState("");
  const generateRandomString = (length: number) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
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
      setRandomString(prevString => changeRandomCharacter(prevString));
      setRandomString(prevString => changeRandomCharacter(prevString));
    }, 50);

    setTimeout(() => clearInterval(interval), 1000);
  };

  const { addPsw } = useContext(ProviderContext);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Password
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Enter your password</AlertDialogTitle>
              <AlertDialogDescription>
                Input your infromations
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid space-y-4 mt-4 mb-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Web Site</FormLabel>
                    <FormControl>
                      <Input placeholder="Add url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Add username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex flex-col justify-center items-left space-y-5">
                        <Input placeholder="Add password" {...field} />
                        <Label className="text-left text-slate-400">Generate Password</Label>
                        <div className="flex justify-center items-center w-full h-4">
                          <div className="flex-grow flex justify-start items-center px-4">
                            {randomString && (
                              <>
                              <div className="flex-grow text-slate-400">
                                {randomString}
                              </div>
                                <HooverAnimation
                                  animationData={Copy}
                                  className="ml-2 h-6 w-6 cursor-pointer"
                                  onClick={()=>{navigator.clipboard.writeText(randomString);
                                    toast({
                                    title: "Copied to clipboard",})}}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="pl-2">
                <LoopAnimation animationData={Error} className="mr-1 h-6 w-6" />
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
  );
}
