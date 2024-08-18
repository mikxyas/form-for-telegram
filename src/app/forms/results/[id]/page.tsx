"use client";

import MainContainer from "@/components/MainContainer";
import { columns, Payment } from "@/components/Responses table/columns";
import { DataTable } from "@/components/Responses table/Table";
import { database } from "@/utils/appwrite/Appwrite";
import { useStore } from "@/zustand/store";
import { Query } from "appwrite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CopyIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import MultipleAnswerComp from "@/components/MultipleAnswerComp";
import QuizComponent from "@/components/QuizComponent";

type Props = {};
// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ];
// }
export default function Results(context: any) {
  const id = context.params.id;
  const [rawResponses, setRawResponses] = useState<any[]>([]);
  const { themeStore, usersForms } = useStore((state) => state);
  const [laoding, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [itemSelected, setItemSelected] = useState(false);
  const router = useRouter();
  function getResponses() {
    // check if userData is empty
    if (usersForms.length == 0) {
      database
        .listDocuments("66a0bb690022ca66f9c3", "66a0bb9e0034dbfdde6d", [
          Query.equal("$id", id),
        ])
        .then((res) => {
          setRawResponses(res.documents[0].response);
          setLoading(false);
          // console.log(res)
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    } else {
      // console.log(usersForms)
      setRawResponses(
        usersForms.filter((form: any) => form.$id == id)[0].response
      );
      setLoading(false);
    }
  }

  function handleItemSelected(id: any) {
    if (itemSelected) {
      setItemSelected(!itemSelected);
    } else {
      const index = rawResponses.findIndex((item) => item.$id == id);
      setIndex(index);
      setItemSelected(!itemSelected);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

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
  useEffect(() => {
    getResponses();
  }, []);

  if (laoding) {
    return (
      <MainContainer>
        <div className="h-screen justify-center items-center flex">
          <p>Loading</p>
        </div>
      </MainContainer>
    );
  }

  if (rawResponses.length == 0) {
    return (
      <MainContainer>
        <div className="h-screen justify-center items-center flex">
          <p>No Responses Yet</p>
        </div>
      </MainContainer>
    );
  }

  return (
    <div className="">
      {itemSelected ? (
        <div className="px-3 mb-10">
          <Button
            variant="ghost"
            className="mb-1"
            onClick={() => setItemSelected(false)}
          >
            <ChevronLeft className="mr-2 " /> Back
          </Button>
          <div className="pb-10">
            {JSON.parse(rawResponses[index].structure).map(
              (form: any, index: number) => (
                <div key={index} className="mt-1.5 ">
                  <Card>
                    <CardHeader>
                      <CardTitle>{form.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      {form.type === "short-answer" && (
                        <div>
                          {typeof form.answer == "undefined" ||
                          form.answer == "" ? (
                            <Label className="py-1 mt-2 w-full mb-1 flex items-center gap-2 text-center ">
                              No Response <InfoCircledIcon />
                            </Label>
                          ) : (
                            <p className=" w-full">{form.answer} </p>
                          )}
                        </div>
                      )}
                      {form.type === "multiple-answer" && (
                        <MultipleAnswerComp
                          form={form}
                          beingViewed={true}
                          isFilling={false}
                          handleOptionTitleChange={() => {}}
                          removeOption={() => {}}
                          addOption={() => {}}
                          updateMultipleChoice={() => {}}
                        />
                      )}
                      {form.type === "quiz" && (
                        <QuizComponent
                          form={form}
                          isFlilling={false}
                          handleOptionTitleChange={() => {}}
                          removeOption={() => {}}
                          addOption={() => {}}
                          updateQuizChoice={() => {}}
                          beingViewed={true}
                        />
                      )}
                    </CardContent>
                    {form.type === "short-answer" && (
                      <CardFooter className="flex justify-end pt-0 ">
                        <Button
                          size="icon"
                          onClick={() => copyToClipboard(form.answer)}
                          variant="outline"
                        >
                          <CopyIcon />
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </div>
              )
            )}
          </div>

          <div className="fixed bottom-0 py-2 -mx-2 items-center  bg-black w-full flex ">
            <div className="ml-2">
              {index == 0 ? (
                <Button variant="outline" size="icon" className="h-full py-3">
                  <ChevronLeft color={themeStore.hint_color} />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-full py-3"
                  onClick={() => setIndex(index - 1)}
                >
                  <ChevronLeft size={23} color={themeStore.hint_color} />
                </Button>
              )}
            </div>
            <div className="flex flex-col items-center w-full justify-center">
              {/* <Image
                src="/profile.webp"
                alt="Vercel Logo"
                className="rounded-full"
                width={33}
                height={33}
              /> */}
              <p className="text-center mt-1">
                {rawResponses[index].profiles.name}
              </p>
            </div>
            <div>
              <div className="mr-4">
                {index == rawResponses.length - 1 ? (
                  <Button variant="outline" className="py-3 h-full" size="icon">
                    <ChevronRight size={23} color={themeStore.hint_color} />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIndex(index + 1)}
                    variant="outline"
                    className="py-3 h-full"
                    size="icon"
                  >
                    <ChevronRight size={23} color={themeStore.hint_color} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rawResponses}
          handleItemSelected={handleItemSelected}
        />
      )}
    </div>
  );
}
