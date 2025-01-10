import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { PreprocessingHyperparametersValue } from "@/api/types";

export const FormInput = ({
  name,
  config,
  control,
  isPending,
}: {
  name: string;
  config: PreprocessingHyperparametersValue;
  control: Control<FieldValues> | undefined;
  isPending: boolean;
}) => {
  switch (config.type) {
    case "integer":
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={config.default}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor={name}>
                {config.label}: {field.value}
              </Label>
              <Slider
                defaultValue={[config.default]}
                min={config.values[0]}
                max={config.values[1]}
                step={1}
                onValueChange={(value) => field.onChange(value[0])}
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
            </div>
          )}
        />
      );
    case "float":
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={config.default}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor={name}>{config.label}</Label>
              <Input
                {...field}
                id={name}
                type="number"
                step={config.type === "float" ? "any" : "1"}
                min={config.values[0]}
                max={config.values[1]}
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
            </div>
          )}
        />
      );
    case "categorical":
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={config.default}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor={name}>{config.label}</Label>
              <Select
                onValueChange={field.onChange}
                defaultValue={
                  field.value?.toString() || config.default.toString()
                }
                disabled={isPending}
              >
                <SelectTrigger id={name}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {config.values.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
            </div>
          )}
        />
      );
    default:
      return null;
  }
};
