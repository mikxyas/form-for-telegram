"use client";
import { useStore } from "@/zustand/store";
import React, { useEffect } from "react";
import Text from "./Text";
import Link from "next/link";
import Button from "./Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Box,
  ChevronRight,
  ChevronsLeftRight,
  Copy,
  Edit,
  Edit2,
  Edit2Icon,
  Edit3,
  NotebookPen,
} from "lucide-react";
import { database } from "@/utils/appwrite/Appwrite";
import { useToast } from "./ui/use-toast";
import FormCard from "./FormCard";
// import FormCard from './FormCard'

type Props = {};

export default function FormsList({}: Props) {
  const { scriptLoaded, usersForms, setUsersForms, themeStore, showArchives } =
    useStore((state) => state);

  const [displayForms, setDisplayForms] = React.useState<any[]>([]);
  // console.log(scriptLoaded)

  useEffect(() => {
    if (showArchives) {
      setDisplayForms(
        usersForms.filter((form: any) => form.isArchived == true)
      );
    } else {
      setDisplayForms(
        usersForms.filter((form: any) => form.isArchived == false)
      );
    }
  }, [showArchives, usersForms]);

  if (!scriptLoaded) {
    return (
      <div className="h-screen bg-transparent flex items-center justify-center">
        <p>...loading</p>
        {/* <Text content='...loading' tw='text-xl text-center mt-4' /> */}
      </div>
    );
  }

  if (typeof window.Telegram === "undefined")
    return <div className="">Not using telegram</div>;
  // console.log(usersForms)
  // if (typeof usersForms == 'undefined') {
  //     return (
  //         <div className='h-screen flex items-center justify-center'>
  //             <Text content='loading' tw='text-xl text-center mt-4' />
  //         </div>
  //     )
  // }
  if (displayForms.length == 0 && !showArchives) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>No Forms Created</p>
        {/* <Text content='No forms created' tw='text-xl text-center mt-4' /> */}
      </div>
    );
  }

  if (displayForms.length == 0 && showArchives) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>No Archived Forms</p>
        {/* <Text content='No forms created' tw='text-xl text-center mt-4' /> */}
      </div>
    );
  }

  return (
    <div className="px-3 ">
      {displayForms.map((survey: any, index: number) => {
        return (
          <div key={index}>
            <FormCard survey={survey} />
          </div>
        );
      })}
    </div>
  );
}
