import {
  useDeleteQuestionnaireById,
  useQuestionnaireList,
} from "@/api/questionnaire";
import { useQueryClient } from "@tanstack/react-query";

export const useQuestionnaireData = () => {
  const queryClient = useQueryClient();
  const { data: questions, isLoading, error } = useQuestionnaireList();

  const { mutate } = useDeleteQuestionnaireById({
    onSuccess: () => {
      console.log("Step deleted successfully");
      invalidateQuestionnaire();
    },
  });

  const sidebarItems =
    questions?.map((question, index) => ({
      id: question.id.code,
      step: index + 1,
      name: question.id.code
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
    })) || [];

  const invalidateQuestionnaire = () => {
    queryClient.invalidateQueries({ queryKey: ["questionnaire", "full"] });
  };

  const onNext = () => {
    // Placeholder for additional logic
    invalidateQuestionnaire();
  };

  const currentIndex = questions?.length || 0;

  const onDelete = (path: number) => {
    if (path === currentIndex) {
      return;
    }
    // TODO: Check if this is the correct behavior
    if (!questions || !questions.length) {
      return;
    }
    const stepsToDelete = [];
    for (let step = currentIndex; step > path; step--) {
      stepsToDelete.push(step);
    }
    try {
      for (const step of stepsToDelete) {
        mutate({ n: step });
      }
    } catch (error) {
      console.error("An error occurred while deleting steps: ", error);
    }
    // Placeholder for additional logic
  };

  const currentQuestion = questions?.length
    ? sidebarItems[questions.length - 1]
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
