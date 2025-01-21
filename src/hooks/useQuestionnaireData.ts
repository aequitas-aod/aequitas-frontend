import { useQuestionnaireList } from "@/api/questionnaire";
import { useQueryClient } from "@tanstack/react-query";

export const useQuestionnaireData = () => {
  const queryClient = useQueryClient();
  const { data: questions, isLoading, error } = useQuestionnaireList();

  const sidebarItems =
    questions?.map((question, index) => ({
      id: question.id.code,
      step: index + 1,
      name: question.id.code,
    })) || [];

  const invalidateQuestionnaire = () => {
    queryClient.invalidateQueries({ queryKey: ["questionnaire", "full"] });
  };

  const onNext = () => {
    // Placeholder for additional logic
    invalidateQuestionnaire();
  };

  const onDelete = () => {
    // Placeholder for additional logic
    invalidateQuestionnaire();
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
