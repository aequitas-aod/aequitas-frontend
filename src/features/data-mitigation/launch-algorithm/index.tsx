import React from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/molecules/FormInput";
import { parseFeatureKey } from "@/lib/utils";
import { useCurrentDataset, useLaunchAlgorithmMutation } from "@/api/context";

import type { PreprocessingHyperparametersResponse } from "@/api/types";

interface LaunchAlgorithmProps {
  title: string;
  description: string;
  formData: PreprocessingHyperparametersResponse;
  algorithm: string;
  onEnableContinueButton: () => void;
  enableContinueButton: boolean;
}

export const LaunchAlgorithm = ({
  title,
  description,
  formData,
  algorithm,
  onEnableContinueButton,
  enableContinueButton,
}: LaunchAlgorithmProps) => {
  const t = useTranslations("DataMitigation");
  const { control, handleSubmit } = useForm();
  const { data: datasetKey } = useCurrentDataset();

  const { mutate, isPending } = useLaunchAlgorithmMutation({
    onSuccess: () => {
      onEnableContinueButton();
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    if (!datasetKey) {
      return;
    }
    const parsedHyperparameters = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        [key, !isNaN(parseFloat(value as string)) ? parseFloat(value as string) : value]
      )
    )
    console.log("Parsed Hyperparameters", parsedHyperparameters);
    mutate({
      dataset: datasetKey,
      body: {
        $algorithm: algorithm,
        ...parsedHyperparameters,
      },
    });
  };

  const renderFormInputs = () => {
    return Object.entries(formData).map(([key, config]) => (
      <FormInput
        key={key}
        name={key}
        config={config}
        control={control}
        isPending={isPending}
      />
    ));
  };

  const renderButton = () => {
    return enableContinueButton ? (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle size={20} />
        <span className="text-md font-bold">
          {t("launch-algorithm.completed")}
        </span>
      </div>
    ) : (
      <Button
        type="submit"
        disabled={isPending}
        variant={isPending ? "secondary" : "outline"}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Run"}
      </Button>
    );
  };

  const algorithmTitle = parseFeatureKey(title);

  return (
    <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full">
      <p className="text-2xl text-primary-950 mb-4 font-extrabold">
        {title === "No Mitigation"
          ? "No Mitigation"
          : t("launch-algorithm.title", { algorithm: algorithmTitle })}
      </p>
      {title === "No Mitigation" ? (
        <p className="text-md text-primary-900">{description}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderFormInputs()}
          <div className="flex justify-end">{renderButton()}</div>
        </form>
      )}
    </div>
  );
};
