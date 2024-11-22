import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import type {
  PreprocessingHyperparametersResponse,
  PreprocessingHyperparametersValue,
} from "@/api/types";

export const LaunchAlgorithm = ({
  formData,
  title,
}: {
  title?: string;
  formData: PreprocessingHyperparametersResponse;
}) => {
  const t = useTranslations("data-mitigation");
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  const renderInput = (
    name: string,
    config: PreprocessingHyperparametersValue
  ) => {
    switch (config.type) {
      case "integer":
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
                />
                <p className="text-sm text-muted-foreground">
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
                <p className="text-sm text-muted-foreground">
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

  return (
    <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full">
      {title ? (
        <p className="text-2xl text-primary-950 mb-4">{title}</p>
      ) : (
        <p className="text-base text-neutral-300">
          {t("launch-algorithm.no-selection")}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {Object.entries(formData).map(([key, config]) => (
          <div key={key}>{renderInput(key, config)}</div>
        ))}
        <Button type="submit">Run</Button>
      </form>
    </div>
  );
};
