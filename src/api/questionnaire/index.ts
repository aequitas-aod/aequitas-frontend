import { useMutation, useQuery } from "@tanstack/react-query";
import { QuestionnaireResponse } from "../types";
import { backendApi } from "../api";
import {
  DeleteQuestionnaireParams,
  PutQuestionnaireParams,
  QuestionnaireParams,
} from "./types";
import { loadOrGenerateProjectId } from "@/storage/session";

export const useQuestionnaireList = () => {
  const query = useQuery<QuestionnaireResponse[]>({
    queryKey: ["questionnaireFull"],
    queryFn: async () => {
      return backendApi.getQuestionnaireList(loadOrGenerateProjectId());
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
      return backendApi.getQuestionnaireById(loadOrGenerateProjectId(), params);
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
      return backendApi.putQuestionnaire(loadOrGenerateProjectId(), params);
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
      return backendApi.putQuestionnaire(loadOrGenerateProjectId(), params);
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
      return backendApi.deleteQuestionnaireById(
        loadOrGenerateProjectId(),
        params
      );
    },
    onSuccess: () => {
      onSuccess();
    },
    retry: false, // failed mutations will not retry.
  });
  return mutation;
};
