import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import type { PreprocessingHyperparametersResponse } from "@/api/types";
import { useLaunchAlgorithmMutation } from "@/api/hooks";
import { Loader2, CheckCircle } from "lucide-react";
import { FormInput } from "@/components/molecules/FormInput";
import { parseFeatureKey } from "@/lib/utils";

export const LaunchAlgorithm = ({
  formData,
  title,
  algorithm,
  onEnableContinueButton,
}: {
  title: string;
  formData: PreprocessingHyperparametersResponse;
  algorithm: string;
  onEnableContinueButton: () => void;
}) => {
  const t = useTranslations("data-mitigation");
  const { control, handleSubmit } = useForm();
  const [isCompleted, setIsCompleted] = useState(false);

  const { mutate, isPending } = useLaunchAlgorithmMutation({
    onSuccess: () => {
      setIsCompleted(true);
      onEnableContinueButton();
    },
  });

  const onSubmit = (data: any) => {
    mutate({
      $algorithm: algorithm,
      ...data,
    });
  };

  return (
    <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full">
      <p className="text-2xl text-primary-950 mb-4 font-extrabold">
        Launch {parseFeatureKey(title)}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {Object.entries(formData).map(([key, config]) => (
          <div key={key}>
            <FormInput
              name={key}
              config={config}
              control={control}
              isPending={isPending}
            />
          </div>
        ))}

        <div className="flex justify-end">
          {isCompleted ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle size={20} />
              <span className="text-md font-bold">Completed</span>
            </div>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              variant={isPending ? "secondary" : "outline"}
            >
              {isPending && <Loader2 className="animate-spin" />}
              {!isPending && "Run"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
