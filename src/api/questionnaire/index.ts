import { useMutation, useQuery } from "@tanstack/react-query";
import { QuestionnaireResponse } from "../types";
import { backendApi } from "../api";
import {
  DeleteQuestionnaireParams,
  PutQuestionnaireParams,
  QuestionnaireParams,
} from "./types";

export const useQuestionnaire = (params: QuestionnaireParams) => {
  const query = useQuery<QuestionnaireResponse>({
    queryKey: ["questionnaire", params],
    queryFn: async () => {
      return backendApi.getQuestionnaire(params);
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
      return backendApi.putQuestionnaire(params);
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
      return backendApi.deleteQuestionnaire(params);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};
