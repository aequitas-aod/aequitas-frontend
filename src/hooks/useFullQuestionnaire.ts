import {
  useDeleteQuestionnaireById,
  useQuestionnaireList,
  useQuestionnaireById,
} from "@/api/questionnaire";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback, useEffect, useState } from "react";

export const useFullQuestionnaire = () => {
  const queryClient = useQueryClient();
  const { data: questions, isLoading, error, refetch } = useQuestionnaireList();
  const { mutateAsync: deleteStep } = useDeleteQuestionnaireById({
    onSuccess: () => {},
  });
  const {
    data: questionData,
    isLoading: questionLoading,
    isError: questionError,
  } = useQuestionnaireById({
    params: {
      n: 1,
    },
    enabled: questions?.length === 0,
  });

  useEffect(() => {
    if (questions && questions.length === 0) {
      console.log("Refetch questionnaire");
      refetch();
    }
  }, [questionData, questionError, questionLoading, queryClient]);

  const onNext = () => {
    console.log("Next question ready");
    refetch();
  };

  const onDelete = useCallback(
    async (path: number) => {
      const currentIndex = questions.length;
      if (path === currentIndex) {
        return;
      }
      if (questions.length === 0) {
        return;
      }

      const stepsToDelete = [];
      for (let step = currentIndex; step > path; step--) {
        stepsToDelete.push(step);
      }
      try {
        for (let step of stepsToDelete) {
          await deleteStep({ n: step });
          console.log(`Question ${step} deleted`);
        }

        console.log("All questions deleted");
        refetch();
      } catch (error) {
        console.error("Error on delete question", error);
      }
    },
    [deleteStep, questions]
  );

  const sidebarItems = useMemo(() => {
    return (
      questions?.map((question, index) => ({
        id: question.id.code,
        step: index + 1,
        name: question.id.code
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
      })) || []
    );
  }, [questions]);

  const currentQuestion = sidebarItems?.length
    ? sidebarItems[sidebarItems.length - 1]
    : null;

  return {
    onNext,
    onDelete,
    currentQuestion,
    isLoading,
    error,
    menuItems: sidebarItems,
  };
};
