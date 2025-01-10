import React from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { FormInput } from "@/components/molecules/FormInput";
import { parseFeatureKey } from "@/lib/utils";
import { useLaunchAlgorithmMutation } from "@/api/context";
import type { PreprocessingHyperparametersResponse } from "@/api/types";

type LaunchAlgorithmProps = {
  title: string;
  description: string;
  formData: PreprocessingHyperparametersResponse;
  algorithm: string;
  onEnableContinueButton: () => void;
  enableContinueButton: boolean;
};

export const LaunchAlgorithm: React.FC<LaunchAlgorithmProps> = ({
  title,
  description,
  formData,
  algorithm,
  onEnableContinueButton,
  enableContinueButton,
}) => {
  const t = useTranslations("DataMitigation");
  const { control, handleSubmit } = useForm();

  const { mutate, isPending } = useLaunchAlgorithmMutation({
    onSuccess: () => {
      onEnableContinueButton();
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    mutate({ $algorithm: algorithm, ...data });
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
