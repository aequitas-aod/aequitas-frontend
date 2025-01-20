/*
 faccio la questionnaire: ti dice tutto il questionario
 da questa popolo la menuItems
 prendo anche l'ultimo step e faccio la get context relativa alla 
*/

import { useQuestionnaireList } from "@/api/questionnaire";
import { useAequitasStore } from "@/store/store";

export const useQuestionnaireData = () => {
  const { currentStep, setCurrentStep, menuItems } = useAequitasStore();

  // 1: AGGIORNO LA SIDEBAR
  const {
    data: questions,
    isLoading: questionsLoading,
    error: questionsError,
  } = useQuestionnaireList();

  const questionNumber = currentStep; // questions.length

  // setMenuItems(questions)

  // TODO: 2: PRENDO IL DATASET CORRENTE DALLA CONTEXT
  // per prendere

  const onNext = () => {
    setCurrentStep(currentStep + 1);
    // dopo andiamo a rifare la chiamata della useQuestionnaireList
  };

  const currentQuestion = menuItems.find((step) => step.step === currentStep);

  return {
    onNext,
    menuItems,
    currentQuestion,
  };
};
