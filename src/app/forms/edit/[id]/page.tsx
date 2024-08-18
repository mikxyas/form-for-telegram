"use client";

import MainContainer from "@/components/MainContainer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { database } from "@/utils/appwrite/Appwrite";
import { useStore } from "@/zustand/store";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { X, CirclePlus } from "lucide-react";
import MultipleAnswerComp from "@/components/MultipleAnswerComp";
import QuizComponent from "@/components/QuizComponent";
import DropdownMenuDemo from "@/components/DropdownComp";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {};

export default function Edit(context: any) {
  const { id } = context.params;
  const [form, setForm] = React.useState<any>([]);
  const [structure, setStructure] = React.useState([]);
  const router = useRouter();
  const { toast } = useToast();
  const { usersForms, setUsersForms, themeStore, telegramId } = useStore(
    (state) => state
  );

  function handleFormTitleChange(id: number, title: string) {
    setStructure((prevForms: any) => {
      return prevForms.map((form: any) => {
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

  function changeTypeOfForm(id: number, type: string) {
    setStructure((prevForms: any) => {
      return prevForms.map((form: any) => {
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

  function handleOptionTitleChange(
    optionId: number,
    formId: number,
    title: string
  ) {
    setStructure((prevForms: any) => {
      return prevForms.map((form: any) => {
        if (form.id === formId) {
          return {
            ...form,
            options: form.options.map((option: any) => {
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
    setStructure((prevForms: any) => {
      return prevForms.map((form: any) => {
        if (form.id === id) {
          return {
            ...form,
            options: [
              ...form.options,
              {
                id: form.options.length + 1,
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
    setStructure((prevForms: any) => {
      return prevForms.map((form: any) => {
        if (form.id === formId) {
          return {
            ...form,
            options: form.options.filter(
              (option: any) => option.id !== optionId
            ),
          };
        }
        return form;
      });
    });
  }

  function updateIsRequired(id: number) {
    setStructure((prevForms: any) => {
      return prevForms.map((form: any) => {
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

  function updateForm() {
    database
      .updateDocument("66a0bb690022ca66f9c3", "66a0bb9e0034dbfdde6d", id, {
        structure: JSON.stringify(structure),
        title: form.title,
        description: form.description,
      })
      .then((response) => {
        // console.log(response)
        if (response) {
          setUsersForms(
            usersForms.map((form: any) => {
              if (form.$id == id) {
                return response;
              }
              return form;
            })
          );
          toast({
            title: "Form Updated",
            // description: 'No longer accepting responses'
          });
          router.push("/");
        } else {
          console.log("error updating the form");
        }
      });
  }

  function removeForm(id: number) {
    setStructure((prevForms: any) => {
      return prevForms.filter((form: any) => form.id !== id);
    });
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

  function getForm() {
    database
      .listDocuments(
        "66a0bb690022ca66f9c3",
        "66a0bb9e0034dbfdde6d",
        // id.toString(),
        [Query.equal("$id", id), Query.equal("creator", telegramId)]
      )
      .then((response: any) => {
        console.log(response);
        setForm(response.documents[0]);
        setStructure(JSON.parse(response.documents[0].structure));
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

  useEffect(() => {
    if (usersForms.length == 0) {
      getForm();
    } else {
      // get the form from the usersForms by the $id
      const form = usersForms.find((form: any) => form.$id == id);
      setForm(form);
      setStructure(JSON.parse(form.structure));
    }
  }, []);

  return (
    <MainContainer>
      <div className="px-3 mt-6">
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.currentTarget.value })}
          className="mb-3"
          placeholder="Form Title"
        />
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.currentTarget.value })
          }
          placeholder="Form Description"
        />
      </div>
      {structure.map((form: any, index) => (
        <div key={index} className="px-3 mt-4 pb-5">
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
                  updateMultipleChoice={() => {}}
                  isFilling={false}
                />
              )}

              {form.type == "quiz" && (
                <QuizComponent
                  form={form}
                  handleOptionTitleChange={handleOptionTitleChange}
                  removeOption={removeOption}
                  addOption={addOption}
                  beingViewed={false}
                  updateQuizChoice={() => {}}
                  isFlilling={false}
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
        onClick={() => updateForm()}
        variant="default"
        className="mb-5 mx-2 w-full "
      >
        Update
      </Button>
    </MainContainer>
  );
}
