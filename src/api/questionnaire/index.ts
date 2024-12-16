import { useMutation, useQuery } from "@tanstack/react-query";
import { QuestionnaireResponse } from "../types";
import { backendApi } from "../api";
import {
  DeleteQuestionnaireParams,
  PutQuestionnaireParams,
  QuestionnaireParams,
} from "./types";
import { PROJECT_CODE } from "@/config/constants";

export const useQuestionnaire = (params: QuestionnaireParams) => {
  const query = useQuery<QuestionnaireResponse>({
    queryKey: ["questionnaire", params],
    queryFn: async () => {
      return backendApi.getQuestionnaire(PROJECT_CODE, params);
    },
  });
  return query;
};

export const useUpdateQuestionnaireMutation = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: (params: PutQuestionnaireParams) => {
      return backendApi.putQuestionnaire(PROJECT_CODE, params);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};

export const useDeleteQuestionnaireMutation = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: (params: DeleteQuestionnaireParams) => {
      return backendApi.deleteQuestionnaire(PROJECT_CODE, params);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};
