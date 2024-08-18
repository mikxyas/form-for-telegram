"use client";

import DropdownMenuDemo from "@/components/DropdownComp";
import MainContainer from "@/components/MainContainer";
import MultipleAnswerComp from "@/components/MultipleAnswerComp";
import QuizComponent from "@/components/QuizComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { database } from "@/utils/appwrite/Appwrite";
import { useStore } from "@/zustand/store";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { ID } from "appwrite";
import { X, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

export default function Create({}: Props) {
  const router = useRouter();

  const [forms, setForms] = useState([
    {
      id: Math.floor(Math.random() * 1000),
      title: "Question",
      type: "short-answer",
      answer: "",
      is_required: false,
      options: [
        {
          id: Math.floor(Math.random() * 1000),
          title: "Option 1",
          ischecked: false,
        },
      ],
    },
    {
      id: Math.floor(Math.random() * 1000),
      title: "Question",
      type: "multiple-answer",
      answer: "",
      is_required: false,
      options: [
        {
          id: Math.floor(Math.random() * 1000),
          title: "Option 1",
          ischecked: false,
        },
      ],
    },
  ]);
  const [surveyTitle, setSurveyTitle] = useState("Untitled Survey");
  const [surveyDescription, setSurveyDescription] = useState("Description");
  const { usersForms, setUsersForms, telegramId } = useStore((state) => state);
  const { toast } = useToast();

  function CreateForm() {
    const promise = database.createDocument(
      "66a0bb690022ca66f9c3",
      "66a0bb9e0034dbfdde6d",
      ID.unique(),
      {
        title: surveyTitle,
        description: surveyDescription,
        creator: telegramId,
        structure: JSON.stringify(forms),
      }
    );

    promise.then(
      function (response) {
        router.push("/");
        toast({
          title: "Form Created",
          // description: 'No longer accepting responses'
        });
        setUsersForms([...usersForms, response]);
        console.log(response);
      },
      function (error) {
        console.log(error);
      }
    );
  }

  function changeTypeOfForm(id: number, type: string) {
    console.log(type);
    setForms((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === id) {
          return {
            ...form,
            type,
          };
        }
        return form;
      });
    });
  }

  function handleFormTitleChange(id: number, title: string) {
    setForms((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === id) {
          return {
            ...form,
            title,
          };
        }
        return form;
      });
    });
  }

  function handleOptionTitleChange(
    optionId: number,
    formId: number,
    title: string
  ) {
    setForms((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === formId) {
          return {
            ...form,
            options: form.options.map((option) => {
              if (option.id === optionId) {
                return {
                  ...option,
                  title,
                };
              }
              return option;
            }),
          };
        }
        return form;
      });
    });
  }

  function addOption(id: number) {
    setForms((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === id) {
          return {
            ...form,
            options: [
              ...form.options,
              {
                // radomize the id creation
                id: Math.floor(Math.random() * 1000),
                title: "Option " + (form.options.length + 1),
                ischecked: false,
              },
            ],
          };
        }
        return form;
      });
    });
  }

  function removeOption(optionId: number, formId: number) {
    setForms((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === formId) {
          return {
            ...form,
            options: form.options.filter((option) => option.id !== optionId),
          };
        }
        return form;
      });
    });
  }

  function updateIsRequired(id: number) {
    setForms((prevForms) => {
      return prevForms.map((form) => {
        if (form.id === id) {
          return {
            ...form,
            is_required: !form.is_required,
          };
        }
        return form;
      });
    });
  }

  function addForm() {
    setForms((prevForms) => {
      return [
        ...prevForms,
        {
          id: Math.floor(Math.random() * 1000),
          title: "Question",
          type: "short-answer",
          answer: "",
          is_required: false,
          options: [
            {
              id: Math.floor(Math.random() * 1000),
              title: "Option 1",
              ischecked: false,
            },
          ],
        },
      ];
    });
  }

  function removeForm(id: number) {
    setForms((prevForms) => {
      return prevForms.filter((form) => form.id !== id);
    });
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
  return (
    <MainContainer>
      <div className="px-3 mt-6">
        <Input
          value={surveyTitle}
          onChange={(e) => setSurveyTitle(e.currentTarget.value)}
          className="mb-3"
          placeholder="Form Title"
        />
        <Textarea
          value={surveyDescription}
          onChange={(e) => setSurveyDescription(e.currentTarget.value)}
          placeholder="Form Description"
        />
      </div>

      {forms.map((form, index) => (
        <div key={index} className="px-3 mt-4">
          <Card>
            <CardHeader className="pt-2 pr-1">
              <div className="flex justify-between flex-row items-center ">
                <CardTitle>Question</CardTitle>
                <Button
                  className=""
                  onClick={() => removeForm(form.id)}
                  size="icon"
                  variant="ghost"
                >
                  <X size={17} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Input
                value={form.title}
                onChange={(e) =>
                  handleFormTitleChange(form.id, e.currentTarget.value)
                }
                className="mb-3"
                placeholder="Question"
              />

              {form.type == "multiple-answer" && (
                <MultipleAnswerComp
                  form={form}
                  handleOptionTitleChange={handleOptionTitleChange}
                  removeOption={removeOption}
                  addOption={addOption}
                  beingViewed={false}
                  isFilling={false}
                  updateMultipleChoice={() => {}}
                />
              )}

              {form.type == "quiz" && (
                <QuizComponent
                  form={form}
                  handleOptionTitleChange={handleOptionTitleChange}
                  removeOption={removeOption}
                  addOption={addOption}
                  isFlilling={false}
                  beingViewed={false}
                  updateQuizChoice={() => {}}
                />
              )}

              <DropdownMenuDemo
                on_change={changeTypeOfForm}
                form_id={form.id}
                form_type={form.type}
              />
            </CardContent>

            <CardFooter className="flex pb-2  justify-end">
              <div
                onClick={() => updateIsRequired(form.id)}
                className="gap-3 cursor-pointer  mb-2 flex items-center"
              >
                <Checkbox checked={form.is_required} />
                <Label>Required</Label>
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
      <Button
        onClick={addForm}
        variant="outline"
        className="mt-2 mb-6 self-end mx-3 "
      >
        Add Form <CirclePlus size={18} className="ml-2" />
      </Button>
      <Button onClick={CreateForm} className="mt-2 mx-3 mb-4 ">
        Create Form
      </Button>
    </MainContainer>
  );
}
