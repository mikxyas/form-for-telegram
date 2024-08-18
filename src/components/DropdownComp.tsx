import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function DropdownMenuDemo({
  form_type,
  on_change,
  form_id,
}: {
  form_type: string;
  on_change: any;
  form_id: any;
}) {
  const [formtype, setFormtype] = React.useState("short-answer");
  React.useEffect(() => {
    setFormtype(form_type);
  }, [formtype, form_type]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex justify-between items-center"
        >
          {formtype === "short-answer" && "Short Answer"}
          {formtype === "multiple-answer" && "Multiple Answers"}
          {formtype === "quiz" && "Quiz Mode"}
          <ChevronDownIcon className="ml-2 self-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuLabel>Form Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={formtype}
          onValueChange={(e) => on_change(form_id, e)}
        >
          <DropdownMenuRadioItem value="short-answer">
            Short Answer
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="multiple-answer">
            Multiple Answers
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="quiz">Quiz Mode</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
