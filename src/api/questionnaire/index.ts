import { useMutation, useQuery } from "@tanstack/react-query";
import { QuestionnaireResponse } from "../types";
import { backendApi } from "../api";
import {
  DeleteQuestionnaireParams,
  PutQuestionnaireParams,
  QuestionnaireParams,
} from "./types";
import { PROJECT_CODE } from "@/config/constants";

export const useQuestionnaireList = () => {
  const query = useQuery<QuestionnaireResponse[]>({
    queryKey: ["questionnaireFull"],
    queryFn: async () => {
      return backendApi.getQuestionnaireList(PROJECT_CODE);
    },
  });
  return query;
};

export const useQuestionnaireById = ({
  params,
  enabled = true,
}: {
  enabled?: boolean;
  params: QuestionnaireParams;
}) => {
  const query = useQuery<QuestionnaireResponse>({
    queryKey: ["questionnaire", params],
    queryFn: async () => {
      return backendApi.getQuestionnaireById(PROJECT_CODE, params);
    },
    enabled: enabled,
  });
  return query;
};

export const useUpdateQuestionnaire = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: (params: PutQuestionnaireParams) => {
      return backendApi.putQuestionnaire(PROJECT_CODE, params);
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    retry: false, // failed mutations will not retry.
  });
  return mutation;
};

export const useUpdateCustomQuestionnaire = ({
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
    retry: false, // failed mutations will not retry.
  });
  return mutation;
};

export const useDeleteQuestionnaireById = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: (params: DeleteQuestionnaireParams) => {
      return backendApi.deleteQuestionnaireById(PROJECT_CODE, params);
    },
    onSuccess: () => {
      onSuccess();
    },
    retry: false, // failed mutations will not retry.
  });
  return mutation;
};
