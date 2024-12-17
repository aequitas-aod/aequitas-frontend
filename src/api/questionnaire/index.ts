import { useMutation, useQuery } from "@tanstack/react-query";
import { QuestionnaireResponse } from "../types";
import { backendApi } from "../api";
import {
  DeleteQuestionnaireParams,
  PutQuestionnaireParams,
  QuestionnaireParams,
} from "./types";

export const useQuestionnaireList = () => {
  const query = useQuery<QuestionnaireResponse[]>({
    queryKey: ["questionnaire", "full"],
    queryFn: async () => {
      return backendApi.getQuestionnaireList();
    },
  });
  return query;
};

export const useQuestionnaireById = (params: QuestionnaireParams) => {
  const query = useQuery<QuestionnaireResponse>({
    queryKey: ["questionnaire", params],
    queryFn: async () => {
      return backendApi.getQuestionnaireById(params);
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
