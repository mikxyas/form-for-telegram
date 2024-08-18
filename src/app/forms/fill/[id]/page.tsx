"use client";

import DropdownMenuDemo from "@/components/DropdownComp";
import MainContainer from "@/components/MainContainer";
import MultipleAnswerComp from "@/components/MultipleAnswerComp";
import QuizComponent from "@/components/QuizComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { database } from "@/utils/appwrite/Appwrite";
import { useStore } from "@/zustand/store";
import { ID, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

export default function Fill(context: any) {
  const { id } = context.params;
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>([]);
  const [doesntExist, setDoesntExist] = useState(false);
  const [survey, setSurvey] = useState({
    title: "Title",
    description: "Description",
  });
  const router = useRouter();
  const [response, setResponse] = useState<any>({});
  const [formAlreadyFilled, setFormAlreadyFilled] = useState(false);
  const [formIsClosed, setFormIsClosed] = useState(false);
  const [modifyResponse, setModifyResponse] = useState(false);

  const { scriptLoaded, telegramId } = useStore((state) => state);

  const updateResponse = async () => {
    await database
      .updateDocument(
        "66a0bb690022ca66f9c3",
        "66a0c535000c3f4e13ae",
        response.$id,
        {
          structure: JSON.stringify(form),
        }
      )
      .then(() => {
        toast({
          title: "Response Updated",
        });
        setModifyResponse(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const submitForm = async () => {
    await database
      .createDocument(
        "66a0bb690022ca66f9c3",
        "66a0c535000c3f4e13ae",
        ID.unique(),
        {
          form: id,
          structure: JSON.stringify(form),
          profiles: telegramId,
        }
      )
      .then((response) => {
        setFormAlreadyFilled(true);
        setResponse(response);
        // console.log(response)
        toast({
          title: "Response Sumbitted",
        });
        setForm(JSON.parse(response.structure));
      });
  };

  // function that checks if the required fields are filled before submitting
  function checkRequiredFields() {
    // loop through the form and check if the required fields are filled
    for (let i = 0; i < form.length; i++) {
      if (form[i].is_required) {
        if (form[i].type == "short-answer") {
          if (form[i].answer == "") {
            // if the required field is empty return false
            return false;
          }
        } else if (form[i].type == "multiple-answer") {
          let ischecked = false;
          for (let j = 0; j < form[i].options.length; j++) {
            if (form[i].options[j].ischecked) {
              ischecked = true;
              break;
            }
          }
          if (!ischecked) {
            return false;
          }
        } else if (form[i].type == "quiz") {
          let ischecked = false;
          for (let j = 0; j < form[i].options.length; j++) {
            if (form[i].options[j].ischecked) {
              ischecked = true;
              break;
            }
          }
          if (!ischecked) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function updateShortAnswer(answer: string, id: any) {
    setForm(
      // @ts-ignore
      form.map((question: any) => {
        if (question.id === id) {
          // incase answer doesn't exist creat it
          const newQ = { ...question, answer: answer };
          return newQ;
        }
        return question;
      })
    );
  }

  function updateMultipleChoice(id: any, option_id: any) {
    setForm(
      // @ts-ignore
      form.map((question: any) => {
        if (question.id === id) {
          // incase answer doesn't exist creat it
          const options = question.options.map((option: any) => {
            if (option.id == option_id) {
              const newOp = { ...option, ischecked: !option.ischecked };
              return newOp;
            }
            return option;
          });
          const qwithOp = { ...question, options };
          return qwithOp;
        }
        return question;
      })
    );
  }

  function updateQuizChoice(id: any, option_id: any) {
    setForm(
      // @ts-ignore
      form.map((question: any) => {
        if (question.id === id) {
          // incase answer doesn't exist creat it
          const options = question.options.map((option: any) => {
            // make everything else false except the one that was clicked
            if (option.id == option_id) {
              const newOp = { ...option, ischecked: !option.ischecked };
              return newOp;
            }
            return { ...option, ischecked: false };
          });
          const qwithOp = { ...question, options };
          return qwithOp;
        }
        return question;
      })
    );
  }
  function extractTelegramId() {
    const unextracted = window.Telegram.WebApp.initData;
    const extracted = decodeURIComponent(unextracted);
    // console.log(extracted)
    const telegram_id: number = JSON.parse(
      extracted.split("&")[0].split("=")[1]
    ).id;
    // console.log(telegram_id)
    return telegram_id.toString();
  }
  const getForm = async () => {
    // check if user has already filled the form
    // try to fetch the response
    database
      .listDocuments("66a0bb690022ca66f9c3", "66a0c535000c3f4e13ae", [
        Query.equal("profiles", extractTelegramId()),
        Query.equal("form", id),
      ])
      .then((response) => {
        // console.log(response)
        if (response.total == 1) {
          // user has already submitted a response
          setFormAlreadyFilled(true);
          if (response.documents[0].form.isClosed) {
            setFormIsClosed(true);
            setLoading(false);
            return;
          }
          setForm(JSON.parse(response.documents[0].structure));
          setSurvey(response.documents[0].form);
          setResponse(response.documents[0]);
          setLoading(false);
        } else {
          database
            .getDocument("66a0bb690022ca66f9c3", "66a0bb9e0034dbfdde6d", id)
            .then((response: any) => {
              // console.log(response)
              setForm(JSON.parse(response.structure));
              setSurvey(response);
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
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

  useEffect(() => {
    getForm();
  }, []);

  if (doesntExist) {
    return (
      <div className="py-2 min-h-screen px-2 flex flex-col">
        <div>Something went wrong</div>
      </div>
    );
  }

  if (!scriptLoaded) {
    return (
      <div className="h-screen flex bg-transparent items-center justify-center">
        <p>Loading</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div
        style={{
          background: window.Telegram.WebApp.themeParams.bg_color,
          color: window.Telegram.WebApp.themeParams.text_color,
        }}
        className="h-screen flex bg-transparent items-center justify-center"
      >
        <p>...fetching</p>
      </div>
    );
  }

  if (formAlreadyFilled && !modifyResponse) {
    return (
      <div className="py-2 min-h-screen px-2 justify-center items-center flex flex-col pb-16">
        <p>Your response has been recorded</p>
        {formIsClosed ? (
          <p>This Form is no longer accepting responses</p>
        ) : (
          <Button className=" mt-3" onClick={() => setModifyResponse(true)}>
            Modify Response
          </Button>
        )}
      </div>
    );
  }

  return (
    <MainContainer>
      <div className="px-3 py2">
        <div className="px-4 mt-2">
          <p className="text-xl"> {survey.title}</p>
          <p>{survey.description}</p>
        </div>

        {form.map((form: any, index: number) => (
          <div key={index} className="px-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{form.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-0">
                {form.type == "short-answer" && (
                  <div className="px-3">
                    <Input
                      value={form.answer}
                      onChange={(e) =>
                        updateShortAnswer(e.currentTarget.value, form.id)
                      }
                      className="mb-3"
                      placeholder="Answer"
                    />
                  </div>
                )}
                {form.type == "multiple-answer" && (
                  <MultipleAnswerComp
                    isFilling={true}
                    form={form}
                    handleOptionTitleChange=""
                    removeOption=""
                    addOption=""
                    updateMultipleChoice={updateMultipleChoice}
                    beingViewed={false}
                  />
                )}

                {form.type == "quiz" && (
                  <QuizComponent
                    form={form}
                    handleOptionTitleChange={""}
                    removeOption={""}
                    addOption={""}
                    updateQuizChoice={updateQuizChoice}
                    isFlilling={true}
                    beingViewed={false}
                  />
                )}

                {form.is_required && (
                  <div className="gap-3 pb-2 cursor-pointer ml-auto  mb-2 flex justify-end">
                    <Label>Required</Label>
                  </div>
                )}
              </CardContent>

              {/* <CardFooter className="flex pb-2  justify-end">

              </CardFooter> */}
            </Card>
          </div>
        ))}
      </div>
      <div className="mb-5 mt-5 px-5">
        {modifyResponse ? (
          <Button
            disabled={!checkRequiredFields()}
            className="w-full"
            onClick={() => updateResponse()}
          >
            Update
          </Button>
        ) : (
          <Button
            disabled={!checkRequiredFields()}
            className="w-full"
            onClick={() => submitForm()}
          >
            Submit
          </Button>
        )}
      </div>
    </MainContainer>
  );
}
