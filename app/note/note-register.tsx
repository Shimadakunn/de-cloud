"use client";
import { useContext } from "react";
import LoopAnimation from "../../lib/loop-animation";

import Checkmark from "../../public/icons/checkmark.json";
import Error from "../../public/icons/error.json";

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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import { toast } from "@/components/ui/use-toast";

import { ProviderContext } from "@/components/provider";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  note: z
    .string()
    .min(2, { message: "You must enter a note" }),
});

export function PswRegister() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      note: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addNote?.(data.name, data.note);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 flex justify-center items-start flex-col space-y-2">
          <div>
            <span className="font-extrabold">Name:</span> {data.name}
          </div>
          <div>
            <span className="font-extrabold">Note:</span> {data.note}
          </div>
        </pre>
      ),
    });
  }

  const { addNote } = useContext(ProviderContext);

  return (
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
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Type your message here." {...field} />
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
