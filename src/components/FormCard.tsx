import Link from "next/link";
import React from "react";
// import Text from './Text'
import { useStore } from "@/zustand/store";
// import Button from './Button'
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { database } from "@/utils/appwrite/Appwrite";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import FormCardDropDown from "./FormCardDropdown";
import { Label } from "./ui/label";
import { ChevronRightIcon } from "@radix-ui/react-icons";

type Props = {
  survey: any;
};

export default function FormCard({ survey }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { themeStore, setUsersForms, usersForms } = useStore((state) => state);
  async function closeSurvey(id: string) {
    setUsersForms(
      usersForms.map((form: any) => {
        if (form.$id === id) {
          form.isClosed = true;
        }
        return form;
      })
    );
    toast({
      title: "Survey Closed",
      description: "No longer accepting responses",
    });
    const resp = await database.updateDocument(
      "66a0bb690022ca66f9c3",
      "66a0bb9e0034dbfdde6d",
      id,
      { isClosed: true }
    );
    // if it fails roll back the update
    // console.log(resp)
    if (!resp)
      setUsersForms(
        usersForms.map((form: any) => {
          if (form.$id === id) {
            form.isClosed = false;
          }
          return form;
        })
      );

    // update the usersForms
  }

  async function archiveSurvey(id: string) {
    setUsersForms(
      usersForms.map((form: any) => {
        if (form.$id === id) {
          form.isArchived = true;
        }
        return form;
      })
    );
    toast({
      title: "Survey saved to archives",
      // description: 'No longer accepting responses'
    });
    const resp = await database.updateDocument(
      "66a0bb690022ca66f9c3",
      "66a0bb9e0034dbfdde6d",
      id,
      { isArchived: true }
    );
    // if it fails roll back the update
    if (!resp)
      setUsersForms(
        usersForms.map((form: any) => {
          if (form.$id === id) {
            form.isArchived = true;
          }
          return form;
        })
      );
  }

  async function unarchiveSurvey(id: string) {
    setUsersForms(
      usersForms.map((form: any) => {
        if (form.$id === id) {
          form.isArchived = false;
          form.isClosed = false;
        }
        return form;
      })
    );
    const resp = await database.updateDocument(
      "66a0bb690022ca66f9c3",
      "66a0bb9e0034dbfdde6d",
      id,
      { isArchived: false, isClosed: false }
    );
    // if it fails roll back the update
    if (!resp)
      setUsersForms(
        usersForms.map((form: any) => {
          if (form.$id === id) {
            form.isArchived = true;
          }
          return form;
        })
      );
  }
  async function openSurvey(id: string) {
    setUsersForms(
      usersForms.map((form: any) => {
        if (form.$id === id) {
          form.isClosed = false;
        }
        return form;
      })
    );
    toast({
      title: "Survey Opened",
      description: "Accepting responses",
    });
    const resp = await database.updateDocument(
      "66a0bb690022ca66f9c3",
      "66a0bb9e0034dbfdde6d",
      id,
      { isClosed: false }
    );
    // if it fails roll back the update
    if (!resp)
      setUsersForms(
        usersForms.map((form: any) => {
          if (form.$id === id) {
            form.isClosed = true;
          }
          return form;
        })
      );
  }
  return (
    <Card className="dark  mt-3 shadow-md">
      <CardHeader className="pt-3">
        <div className="flex justify-between items-center ">
          <div className="w-full">
            <Link
              className="cursor-pointer w-full"
              href={`/forms/results/` + survey.$id}
            >
              <CardTitle className="w-full">{survey.title}</CardTitle>
            </Link>
          </div>
          <div className="w-4 mr-2 self-start">
            <FormCardDropDown
              form_id={survey.$id}
              openSurvey={openSurvey}
              closeSurvey={closeSurvey}
              archiveSurvey={archiveSurvey}
              survey={survey}
              unarchiveSurvey={unarchiveSurvey}
            />
          </div>
        </div>
        <Link className="cursor-pointer" href={`/forms/results/` + survey.$id}>
          <CardDescription>
            {survey.description.length >= 100
              ? survey.description.substring(0, 100) + "..."
              : survey.description}
          </CardDescription>
        </Link>
      </CardHeader>
      <Link className=" cursor-pointer" href={`/forms/results/` + survey.$id}>
        <CardContent className="flex  items-center justify-between">
          <Label className="">{`${survey.response.length} responses`}</Label>
          {survey.isClosed ? (
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-red-500" />
          ) : (
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500" />
          )}
        </CardContent>
      </Link>
      {/* <CardFooter>
      
      </CardFooter> */}
    </Card>
  );
}
