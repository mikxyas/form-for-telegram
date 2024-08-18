"use client";

import { account } from "@/utils/appwrite/Appwrite";
import { useStore } from "@/zustand/store";
import { Archive, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

type Props = {};

export default function ArchivedComp({}: Props) {
  const { themeStore } = useStore((state) => state);

  async function logout() {
    const result = await account.deleteSessions();

    console.log(result);
  }

  return (
    <div className="fixed mt-auto  flex flex-col justify-center items-center  bottom-2 right-2">
      <Button asChild>
        <Link href="forms/archives">
          Archives
          <Archive size={17} color={themeStore.hint_color} />
        </Link>
      </Button>

      {/* <button
        onClick={logout}
        className="py-2  mb-2 cursor-pointer   shadow-sm  px-2 rounded-full"
        style={{ background: themeStore.secondary_bg_color }}
      >
        <div
          className="py-4 cursor-pointer px-4 rounded-full"
          style={{ background: themeStore.button_color }}
        >
          <LogOut color={themeStore.button_text_color} />
        </div>
      </button> */}
      {/* <Link href="forms/create">
        <div
          className="py-4 cursor-pointer px-4 rounded-full"
          style={{ background: themeStore.button_color }}
        >
          <Plus color={themeStore.button_text_color} />
        </div>
      </Link> */}
    </div>
  );
}
