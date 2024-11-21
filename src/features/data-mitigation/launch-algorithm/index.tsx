import {
  PreprocessingHyperparametersResponse,
  PreprocessingHyperparametersValue,
} from "@/api/types";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import React, { Fragment } from "react";
import { Form, FormItem, FormLabel } from "@/components/ui/form";

export const LaunchAlgorithm = ({
  formData,
  title,
}: {
  title?: string;
  formData: PreprocessingHyperparametersResponse;
}) => {
  const t = useTranslations("data-mitigation");
  // Create a form based on the configuration
  const form = useForm({
    // resolver: zodResolver(FormSchema), // Assuming a validation schema exists
    defaultValues: Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key].default;
      return acc;
    }, {}),
  });

  const onSubmit = (data: any) => {};

  // Dynamic field rendering
  const renderField = (
    key: string,
    fieldConfig: PreprocessingHyperparametersValue
  ) => {
    const { label, type, values, default: defaultValue } = fieldConfig;

    switch (type) {
      case "integer":
        return (
          <Fragment key={key}>
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <Input
                type="number"
                {...form.register(key)}
                defaultValue={defaultValue}
              />
            </FormItem>
          </Fragment>
        );

      case "float":
        return (
          <Fragment key={key}>
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...form.register(key)}
                defaultValue={defaultValue}
              />
            </FormItem>
          </Fragment>
        );

      case "categorical":
        return <Fragment key={key}></Fragment>;

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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 h-full"
        >
          {/* Dynamically render each field based on the configuration */}
          {Object.keys(formData).map((key) => renderField(key, formData[key]))}

          <div className="flex justify-end mt-auto">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
