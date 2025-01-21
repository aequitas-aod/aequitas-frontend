import { useQuestionnaireList } from "@/api/questionnaire";
import { SidebarItem } from "../../mocks/sidebar";

export const useQuestionnaireData = () => {
  // Ottieni le domande dal server
  const {
    data: questions,
    isLoading: questionsLoading,
    error: questionsError,
  } = useQuestionnaireList();

  let sidebarItems: SidebarItem[] = [];

  if (questions && questions.length > 0) {
    sidebarItems = questions.map((question, index) => ({
      id: question.id.code,
      step: index + 1,
      name: question.id.code,
    }));
    // setMenuItems(sidebarItems);
  }

  const currentStep = questions ? questions.length : 0;

  // Funzione per andare alla prossima domanda
  const onNext = () => {
    if (questions && currentStep < questions.length) {
      // setCurrentStep(currentStep + 1);
    }
  };

  // current question è l'ultimo elemento dell'array
  const currentQuestion = sidebarItems[currentStep - 1];
  return {
    onNext,
    questions,
    currentQuestion,
    questionsLoading,
    questionsError,
    menuItems: sidebarItems,
  };
};
