import {
  useDeleteQuestionnaireById,
  useQuestionnaireList,
  useQuestionnaireById,
} from "@/api/questionnaire";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback, useEffect } from "react";

export const useQuestionnaireFull = () => {
  const queryClient = useQueryClient();
  const { data: questions, isLoading, error, refetch } = useQuestionnaireList();

  const questionNumber = questions?.length ? questions.length : 1;

  const {
    data: questionData,
    isLoading: questionLoading,
    isError: questionError,
  } = useQuestionnaireById({
    n: questionNumber,
  });

  useEffect(() => {
    if (questions && questions.length === 0) {
      console.log("Refetch questionnaire");
      refetch();
    }
  }, [questionData, questionError, questionLoading, queryClient]);

  const { mutateAsync: deleteStep } = useDeleteQuestionnaireById({
    onSuccess: () => {},
  });

  const onNext = () => {
    refetch();
  };

  const currentIndex = questions?.length || 0;

  const onDelete = useCallback(
    async (path: number) => {
      if (path === currentIndex) {
        return;
      }
      if (!questions || !questions.length) {
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
    [currentIndex, deleteStep, questions]
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
