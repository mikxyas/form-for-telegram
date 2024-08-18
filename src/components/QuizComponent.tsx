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
  updateQuizChoice: any;
  isFlilling: boolean;
  beingViewed: boolean;
};

export default function QuizComponent({
  form,
  handleOptionTitleChange,
  removeOption,
  addOption,
  isFlilling,
  updateQuizChoice,
  beingViewed,
}: Props) {
  return (
    <div>
      <RadioGroup className="mb-6 px-2" onChange={() => {}}>
        {form.options.map((option: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem
              value="default"
              disabled={!isFlilling || beingViewed}
              checked={option.ischecked}
              onClick={() => updateQuizChoice(form.id, option.id)}
              id="r1"
            />
            {isFlilling || beingViewed ? (
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
          </div>
        ))}
        {!isFlilling && !beingViewed && (
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
    </div>
  );
}
