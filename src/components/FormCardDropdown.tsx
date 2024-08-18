import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/zustand/store";
import { useToast } from "./ui/use-toast";
import { database } from "@/utils/appwrite/Appwrite";

export default function FormCardDropDown({
  form_id,
  survey,
  openSurvey,
  archiveSurvey,
  closeSurvey,
  unarchiveSurvey,
}: any) {
  const { setUsersForms, usersForms } = useStore((state) => state);
  const { toast } = useToast();
  async function copyLinkToClipboard() {
    const surveyLink = `https://t.me/Formfortelegrambot/TelegramForms?startapp=${survey.$id}`;
    await navigator.clipboard.writeText(surveyLink);
  }

  async function deleteForm() {
    setUsersForms(usersForms.filter((form: any) => form.$id !== survey.$id));

    await database
      .deleteDocument(
        "66a0bb690022ca66f9c3",
        "66a0bb9e0034dbfdde6d",
        survey.$id
      )
      .then(() => {
        // setIsOpen(false);
        toast({
          title: "Success",
          description: "Form Deleted",
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "Something went wrong",
        });
        // roll back the update
        setUsersForms([...usersForms, survey]);
      });
  }

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="icon">
          <EllipsisVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3">
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <Link href={`/forms/edit/${survey.$id}`}>
            <DropdownMenuItem>
              Edit
              {/* <DropdownMenuShortcut>
              <Edit />
            </DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </Link>

          {!survey.isClosed && !survey.isArchived && (
            <>
              <DropdownMenuItem onClick={() => copyLinkToClipboard()}>
                Copy Link
                {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/forms/card/" + survey.$id)}
              >
                Get Form Card
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          {survey.isClosed && !survey.isArchived && (
            <div>
              <DropdownMenuItem
                //   className="w-full  rounded-lg mb-1"
                onClick={() => openSurvey(survey.$id)}
              >
                Reopen Survey
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => archiveSurvey(survey.$id)}>
                Archive Survey
              </DropdownMenuItem>
            </div>
          )}

          {survey.isClosed && survey.isArchived && (
            <DropdownMenuItem
              //   className="w-full  rounded-lg mb-1"
              onClick={() => unarchiveSurvey(survey.$id)}
            >
              Unarchive Survey
            </DropdownMenuItem>
          )}
          {!survey.isClosed && !survey.isArchived && (
            <DropdownMenuItem onClick={() => closeSurvey(survey.$id)}>
              Close Survey
            </DropdownMenuItem>
          )}
          {/* <div>
            <DeleteFormButton form_id={survey.$id} />
          </div> */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Delete Form</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>Are your sure?</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => deleteForm()}>
                  Yes delete form
                </DropdownMenuItem>
                <DropdownMenuItem>Cancel</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
