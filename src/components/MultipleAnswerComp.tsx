import React from "react";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, CirclePlus } from "lucide-react";
import { Label } from "./ui/label";

type Props = {
  form: any;
  handleOptionTitleChange: any;
  removeOption: any;
  addOption: any;
  updateMultipleChoice: any;
  isFilling: boolean;
  beingViewed: boolean;
};

export default function MultipleAnswerComp({
  form,
  handleOptionTitleChange,
  removeOption,
  addOption,
  updateMultipleChoice,
  isFilling,
  beingViewed,
}: Props) {
  return (
    <RadioGroup className="mb-6 px-2">
      {form.options.map((option: any, index: any) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem
            value="default"
            disabled={!isFilling || beingViewed}
            checked={option.ischecked}
            onClick={() => updateMultipleChoice(form.id, option.id)}
            id="r1"
          />
          {isFilling || beingViewed ? (
            <Label>{option.title}</Label>
          ) : (
            <div className="flex items-center  space-x-2">
              <Input
                value={option.title}
                type="text"
                onChange={(e) =>
                  handleOptionTitleChange(
                    option.id,
                    form.id,
                    e.currentTarget.value
                  )
                }
              />
              <Button
                size="icon"
                variant={"ghost"}
                disabled={form.options.length === 1}
                onClick={() => removeOption(option.id, form.id)}
              >
                <X size={20} />
              </Button>
            </div>
          )}

          {/* <Label htmlFor="r1">{option.title}</Label> */}
        </div>
      ))}
      {!isFilling && !beingViewed && (
        <div className="flex items-center  flex-col space-x-2">
          <Button
            variant="outline"
            className=" self-end mt-1"
            size="sm"
            onClick={() => addOption(form.id)}
          >
            <CirclePlus size={15} className="mr-2" />
            Add Option
          </Button>
        </div>
      )}
    </RadioGroup>
  );
}
