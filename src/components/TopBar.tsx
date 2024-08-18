"use client";

import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import {
  ArchiveIcon,
  ChevronLeftIcon,
  HomeIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useStore } from "@/zustand/store";
import { ArrowLeft } from "lucide-react";
type Props = {};

export default function TopBar({}: Props) {
  const { showArchives, setShowArchives } = useStore((state) => state);
  return (
    <div
      style={{ background: "#09090B" }}
      className="px-3 py-1 fixed  z-50 flex items-center justify-between w-full"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/logo.jpg"
          alt="Telegram Forms"
          className="rounded-lg"
          width={33}
          height={33}
        />
        {showArchives && <p>Archives</p>}
      </div>
      <div className=" gap-3 flex items-center w">
        <Button
          onClick={() => setShowArchives(!showArchives)}
          variant="outline"
          className="ml-2 rounded-full"
          size="icon"
        >
          {!showArchives ? <ArchiveIcon /> : <ArrowLeft />}
        </Button>
        <Link href="/forms/create">
          <Button variant="secondary">
            Create <PlusIcon className="ml-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
