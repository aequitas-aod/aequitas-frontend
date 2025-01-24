"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { FormSchema, FormValues } from "./schema";
import { CheckIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { convertCSVToString } from "@/lib/utils";
import { useUpdateContextCsv } from "@/api/context";
import { EnhancedAnswerResponse } from "@/types/types";
import { ButtonLoading } from "@/components/ui/loading-button";
import { DEFAULT_CUSTOM_DATASET_NAME } from "@/config/constants";

export const CreateDatasetDialog = ({
  questionNumber,
  selected,
  onNext,
}: {
  questionNumber: number;
  selected: EnhancedAnswerResponse;
  onNext: () => void;
}) => {
  const t = useTranslations("DatasetSelection");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: updateQuestionnaire } = useUpdateQuestionnaire({});
  const { mutateAsync: updateContext } = useUpdateContextCsv({});

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const cleanFileName = (fileName: string) => {
    return fileName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ");
  };

  useEffect(() => {
    if (file) {
      const cleanedName = cleanFileName(file.name);
      form.setValue("name", cleanedName);
      form.setValue(
        "description",
        `Dataset created from the file: ${cleanedName}`
      );

      // Forza il form a "toccare" i campi dopo il loro aggiornamento
      form.setFocus("name");
      form.setFocus("description");
      form.trigger(["name", "description"]);
    }
  }, [file, form]);

  const handleCreate = async () => {
    if (!selected || !file) {
      return;
    }
    const csvString = await convertCSVToString(file);
    try {
      // Chiamata 1: PUT /questionnaire
      await updateQuestionnaire({
        n: questionNumber,
        answer_ids: [
          {
            code: selected.id.code,
            question_code: selected.id.question_code,
            project_code: selected.id.project_code,
          },
        ],
      });
      // Chiamata 2: PUT /context
      await updateContext({
        dataset: DEFAULT_CUSTOM_DATASET_NAME,
        body: csvString,
      });

      console.log("Operazioni completate con successo!");
    } catch (error) {
      console.error("Errore durante la creazione:", error);
    }
  };

  const onSubmit = () => {
    handleCreate();
    onNext();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const handleFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isDisabled = !file || !form.formState.isValid;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {t("create-custom-dataset-dialog.create")}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            form.reset(); // Reset dei dati del form
            setFile(null); // Reset del file caricato
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("create-custom-dataset-dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("create-custom-dataset-dialog.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Upload File Section moved up */}
              {file ? (
                <>
                  <div className="flex items-center space-x-2 justify-between">
                    <div className="flex items-center space-x-2 justify-between">
                      <Button size="icon" disabled>
                        <CheckIcon className="w-4 h-4" />
                      </Button>
                      <p>{file.name}</p>
                    </div>
                    <TrashIcon
                      onClick={() => setFile(null)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={handleFileInput}
                >
                  <Button variant="outline" size="icon" disabled>
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                  <p className="cursor-pointer">
                    {t("create-custom-dataset-dialog.upload-file")}
                  </p>
                  <Input
                    id="csv"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("create-custom-dataset-dialog.name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "create-custom-dataset-dialog.name-placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("create-custom-dataset-dialog.description")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          "create-custom-dataset-dialog.description-placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <ButtonLoading
                  type="submit"
                  disabled={isDisabled}
                  isLoading={form.formState.isSubmitting}
                >
                  {t("create-custom-dataset-dialog.submit")}
                </ButtonLoading>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
