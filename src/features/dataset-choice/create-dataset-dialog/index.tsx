"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { FormSchema, FormValues } from "./schema";

export const CreateDatasetDialog = () => {
  const t = useTranslations("dataset-choice");
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data, null, 2));
    setOpen(false);
  };

  return (
    <>
      {/* Button to open the dialog */}
      <Button onClick={() => setOpen(true)}>
        {t("create-custom-dataset-dialog.create")}
      </Button>

      {/* Dialog Component */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("create-custom-dataset-dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("create-custom-dataset-dialog.subtitle")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Description Field */}
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

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit">
                  {t("create-custom-dataset-dialog.submit")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
