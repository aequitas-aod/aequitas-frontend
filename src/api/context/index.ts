import { useMutation, useQuery } from "@tanstack/react-query";

import { BackendApi } from "../api";
import { PROJECT_CODE } from "@/config/constants";

import type {
  AnswerContextResponse,
  DetectionDataParams,
  FeaturesParams,
  FeaturesResponse,
  MetricsResponse,
  ProcessingHyperparametersResponse,
  ProxyDataParams,
  ProxyDataResponse,
} from "../types";
import type { ProcessingType } from "@/types/types";

const backendApi = new BackendApi();

export const useCurrentDataset = () => {
  const query = useQuery<string>({
    queryKey: ["current_dataset"],
    queryFn: async () => {
      return backendApi.getCurrentDataset(PROJECT_CODE);
    },
  });
  return query;
};

export const useCurrentTestDataset = () => {
  const query = useQuery<string>({
    queryKey: ["test_current_dataset"],
    queryFn: async () => {
      return backendApi.getCurrentTestDataset(PROJECT_CODE);
    },
  });
  return query;
};

export const useMutationFeatures = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: ({
      dataset,
      body,
    }: {
      dataset?: string;
      body: FeaturesParams;
    }) => {
      return backendApi.putFeatures(PROJECT_CODE, dataset!, body);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};

export const useMutationProxies = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: ({
      dataset,
      body,
    }: {
      dataset?: string;
      body: ProxyDataParams;
    }) => {
      return backendApi.putProxies(PROJECT_CODE, dataset!, body);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};

export const useMutationDetected = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: ({
      dataset,
      body,
    }: {
      dataset?: string;
      body: DetectionDataParams;
    }) => {
      return backendApi.putDetected(PROJECT_CODE, dataset!, body);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};

// dataset view
export const useDatasetsContext = () => {
  const query = useQuery<AnswerContextResponse[]>({
    queryKey: ["datasets"],
    queryFn: async () => {
      return backendApi.getDatasetsInfo(PROJECT_CODE);
    },
  });
  return query;
};

export const useDatasetHeadContext = (dataset?: string) => {
  const query = useQuery<string>({
    queryKey: ["dataset", dataset],
    queryFn: async () => {
      return backendApi.getContextCsv(PROJECT_CODE, dataset!, "dataset_head");
    },
    enabled: !!dataset,
  });
  return query;
};

// features-view
export const useStatsContext = (dataset?: string) => {
  const query = useQuery<string>({
    queryKey: ["stats", dataset],
    queryFn: async () => {
      return backendApi.getContextCsv(PROJECT_CODE, dataset!, "stats");
    },
    enabled: !!dataset,
  });
  return query;
};

// detection view
export const useFeaturesContext = (dataset?: string) => {
  const query = useQuery<FeaturesResponse>({
    queryKey: ["features", dataset],
    queryFn: async () => {
      return backendApi.getFeaturesContext(PROJECT_CODE, dataset!);
    },
    enabled: !!dataset,
  });
  return query;
};

export const useMetricsContext = (dataset?: string, feature?: string) => {
  const query = useQuery<MetricsResponse>({
    queryKey: ["metrics", dataset],
    queryFn: async () => {
      return backendApi.getMetricsContext(PROJECT_CODE, dataset!);
    },
    enabled: !!dataset && !!feature,
  });
  return query;
};

// dependencies
export const useSuggestedProxies = (dataset?: string) => {
  const query = useQuery<ProxyDataResponse>({
    queryKey: ["suggested-proxies", dataset],
    queryFn: async () => {
      return backendApi.getSuggestedProxies(PROJECT_CODE, dataset!);
    },
    enabled: !!dataset,
  });
  return query;
};

export const useCorrelationMatrix = (dataset?: string) => {
  const query = useQuery<string>({
    queryKey: ["correlation-matrix", dataset],
    queryFn: async () => {
      return backendApi.getContextVectorialData(
        PROJECT_CODE,
        dataset!,
        "correlation_matrix"
      );
    },
    enabled: !!dataset,
  });
  return query;
};

export const useDependencyGraph = (dataset?: string) => {
  const query = useQuery<string>({
    queryKey: ["dependency-graph", dataset],
    queryFn: async () => {
      return backendApi.getContextVectorialData(
        PROJECT_CODE,
        dataset!,
        "dependency_graph"
      );
    },
    enabled: !!dataset,
  });
  return query;
};

// data-mitigation
export const useProcessingHyperparameters = (
  algorithm: string | null,
  hyperparameterType: ProcessingType
) => {
  const query = useQuery<ProcessingHyperparametersResponse>({
    queryKey: ["hyperparameters", algorithm, hyperparameterType],
    queryFn: async () => {
      return backendApi.getProcessingHyperparametersContext(
        PROJECT_CODE,
        algorithm!,
        hyperparameterType
      );
    },
    enabled: !!algorithm,
  });
  return query;
};

export const useLaunchAlgorithmMutation = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: ({
      dataset,
      body,
      hyperparameterType,
    }: {
      dataset?: string;
      body: Record<string, unknown>;
      hyperparameterType: ProcessingType;
    }) => {
      return backendApi.putProcessingContext(
        PROJECT_CODE,
        dataset!,
        body,
        hyperparameterType
      );
    },
    onSuccess: () => {
      onSuccess();
    },
    retry: false, // failed mutations will not retry.
  });
  return mutation;
};

export const useUpdateContextCsv = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: (params: { dataset?: string; body: string }) => {
      return backendApi.putContext(
        PROJECT_CODE,
        "dataset__" + params.dataset,
        params.body
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
