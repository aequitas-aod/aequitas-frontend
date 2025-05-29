import {
  useDeleteQuestionnaireById,
  useQuestionnaireById,
  useQuestionnaireList,
} from "@/api/questionnaire";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";

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
      let currentIndex = questions.length;
      if (path === currentIndex) {
        currentIndex = currentIndex + 1; // if going back to the last question
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

  return {
    onNext,
    onDelete,
    questions,
    isLoading,
    error,
    menuItems: sidebarItems,
  };
};
