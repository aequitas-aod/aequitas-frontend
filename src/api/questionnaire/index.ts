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
      return backendApi.getQuestionnaireList(await loadOrGenerateProjectId());
    },
  });
  return query;
};

export const useQuestionnaireById = ({
  params,
  enabled = true,
  retry = 3,
}: {
  params: QuestionnaireParams;
  enabled?: boolean;
  retry?: number;
}) => {
  const query = useQuery<QuestionnaireResponse>({
    queryKey: ["questionnaire", params],
    queryFn: async () => {
      return backendApi.getQuestionnaireById(
        await loadOrGenerateProjectId(),
        params
      );
    },
    enabled: enabled,
    retry: retry,
  });
  return query;
};

export const useUpdateQuestionnaire = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (params: PutQuestionnaireParams) => {
      return backendApi.putQuestionnaire(
        await loadOrGenerateProjectId(),
        params
      );
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
    mutationFn: async (params: PutQuestionnaireParams) => {
      return backendApi.putQuestionnaire(
        await loadOrGenerateProjectId(),
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

export const useDeleteQuestionnaireById = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (params: DeleteQuestionnaireParams) => {
      return backendApi.deleteQuestionnaireById(
        await loadOrGenerateProjectId(),
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
