"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { functions, storage } from "@/utils/appwrite/Appwrite";
import { useStore } from "@/zustand/store";
import { ID } from "appwrite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

export default function AdCard(context: any) {
  const id = context.params.id;
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { telegramId, usersForms } = useStore((state) => state);

  const [uploadedImageId, setUploadedImageId] = useState<string>("none");

  //   const selectedForm = usersForms.find((form: any) => form.$id === id);
  const [openedForm, setOpenedForm] = useState<any>(null);
  const handleFileChange = (event: any) => {
    // console.log("asdasd");
    if (event.target.files[0]) {
      console.log(event.target.files[0]);
      setFile(event.target.files[0]);
    }
  };

  async function makeBotSendImage(imageURL: string) {
    const title = "";
    const description = "";
    const url = `https://forms-image-gen-t-96.deno.dev/og-images/?site=customers&title=${title}&description=${description}`;
    // execute the edge function
    const data = {
      image_url: url,
      chat_id: telegramId,
    };
    const promise = await functions.createExecution(
      "66a4ab4e0026fb046d0c",
      JSON.stringify(data)
    );
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const response = await storage.createFile(
        "66c1ddbe000b050da782", // Replace with your Appwrite bucket ID
        ID.unique(),
        file
        //   document.getElementById('uploader').files[0]
      );
      // get the url of the uploaded image
      const imageId = response["$id"];
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/Formfortelegrambot?start=${id + "_" + imageId}`
      );

      console.log("File uploaded successfully", response);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    const tg = window.Telegram.WebApp;

    // Show the back button
    tg.BackButton.show();

    // Handle the back button click
    tg.BackButton.onClick(() => {
      // Perform the action you want when the back button is clicked
      // For example, navigate to the previous page or close the app
      router.push("/");
      console.log("Back button clicked");
    });

    // Cleanup function to hide the back button when the component unmounts
    return () => {
      tg.BackButton.hide();
    };
  }, []);
  //   console.log(id);
  //   console.log(usersForms.find((form: any) => form.$id === id));
  useEffect(() => {
    if (usersForms.length > 0) {
      //   const selectedForm = usersForms.find((form: any) => form.$id === id);
      setOpenedForm(usersForms.find((form: any) => form.$id === id));
    }
  }, [usersForms]);

  if (!id) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  if (usersForms.length === 0) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <p className="mb-4 mt-4 text-center">Get Promo Card from bot</p>
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Upload your own image to advertise the form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture" className="mb-1">
              Choose an Image
            </Label>
            <Input onChange={handleFileChange} id="picture" type="file" />
          </div>
        </CardContent>
        {file != null && (
          <CardFooter>
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleUpload}
            >
              Upload Image and Get Card
            </Button>
          </CardFooter>
        )}
      </Card>
      <Card className="mt-3">
        <CardHeader>
          <CardTitle>Use Generated Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid mt-3 w-full max-w-sm items-center gap-1.5">
            {/* <Label htmlFor="bbb">Or This Image</Label> */}
            <Image
              height="300"
              loader={({ src }) => src}
              alt="ad"
              width="300"
              className="border border-white rounded-xl border-opacity-40 "
              src={`https://forms-image-gen-t-96.deno.dev/og-images/?site=customers&title=${openedForm?.title}&description=${openedForm?.description}`}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              window.Telegram.WebApp.openTelegramLink(
                `https://t.me/Formfortelegrambot?start=${id + "_" + "none"}`
              );
            }}
            variant="secondary"
            className="mt-3 w-full"
          >
            Get Generated Image
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
