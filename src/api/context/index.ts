import { useMutation, useQuery } from "@tanstack/react-query";

import { BackendApi } from "../api";

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
import { loadOrGenerateProjectId } from "@/storage/session";

const backendApi = new BackendApi();

export const useDatasetType = () => {
  const query = useQuery<string>({
    queryKey: ["dataset_type"],
    queryFn: async () => {
      return backendApi.getDatasetType(await loadOrGenerateProjectId());
    },
  });
  return query;
};

export const useCurrentDataset = () => {
  const query = useQuery<string>({
    queryKey: ["current_dataset"],
    queryFn: async () => {
      return backendApi.getCurrentDataset(await loadOrGenerateProjectId());
    },
  });
  return query;
};

export const useCurrentTestDataset = () => {
  const query = useQuery<string>({
    queryKey: ["current_test_dataset"],
    queryFn: async () => {
      return backendApi.getCurrentTestDataset(await loadOrGenerateProjectId());
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
    mutationFn: async ({
      dataset,
      body,
    }: {
      dataset?: string;
      body: FeaturesParams;
    }) => {
      return backendApi.putFeatures(
        await loadOrGenerateProjectId(),
        dataset!,
        body
      );
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
    mutationFn: async ({
      dataset,
      body,
    }: {
      dataset?: string;
      body: ProxyDataParams;
    }) => {
      return backendApi.putProxies(
        await loadOrGenerateProjectId(),
        dataset!,
        body
      );
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
    mutationFn: async ({
      dataset,
      body,
    }: {
      dataset?: string;
      body: DetectionDataParams;
    }) => {
      return backendApi.putDetected(
        await loadOrGenerateProjectId(),
        dataset!,
        body
      );
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
      return backendApi.getDatasetsInfo(await loadOrGenerateProjectId());
    },
  });
  return query;
};

export const useDatasetHeadContext = (dataset?: string) => {
  const query = useQuery<string>({
    queryKey: ["dataset", dataset],
    queryFn: async () => {
      return backendApi.getContextCsv(
        await loadOrGenerateProjectId(),
        dataset!,
        "dataset_head"
      );
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
      return backendApi.getContextCsv(
        await loadOrGenerateProjectId(),
        dataset!,
        "stats"
      );
    },
    enabled: !!dataset,
  });
  return query;
};

export const usePredictionsContext = (dataset?: string, algorithm?: string) => {
  const query = useQuery<string>({
    queryKey: ["predictions_head", dataset, algorithm],
    queryFn: async () => {
      return backendApi.getPredictionsContext(
        await loadOrGenerateProjectId(),
        dataset!,
        algorithm!
      );
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
      return backendApi.getFeaturesContext(
        await loadOrGenerateProjectId(),
        dataset!
      );
    },
    enabled: !!dataset,
  });
  return query;
};

export const useMetricsContext = (dataset?: string, feature?: string) => {
  const query = useQuery<MetricsResponse>({
    queryKey: ["metrics", dataset],
    queryFn: async () => {
      return backendApi.getMetricsContext(
        await loadOrGenerateProjectId(),
        dataset!
      );
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
      return backendApi.getSuggestedProxies(
        await loadOrGenerateProjectId(),
        dataset!
      );
    },
    enabled: !!dataset,
  });
  return query;
};

export const useContextVectorialData = (key: string, dataset?: string) => {
  const query = useQuery<string>({
    queryKey: [key, dataset],
    queryFn: async () => {
      return backendApi.getContextVectorialData(
        await loadOrGenerateProjectId(),
        dataset!,
        key
      );
    },
    enabled: !!dataset,
  });
  return query;
};

export const useContextCsv = (key: string, dataset?: string) => {
  const query = useQuery<string>({
    queryKey: [key, dataset],
    queryFn: async () => {
      return backendApi.getContextCsv(
        await loadOrGenerateProjectId(),
        dataset!,
        key
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
        await loadOrGenerateProjectId(),
        dataset!,
        "dependency_graph"
      );
    },
    enabled: !!dataset,
  });
  return query;
};

// mitigation
export const useProcessingHyperparameters = (
  algorithm: string | null,
  hyperparameterType: ProcessingType
) => {
  const query = useQuery<ProcessingHyperparametersResponse>({
    queryKey: ["hyperparameters", algorithm, hyperparameterType],
    queryFn: async () => {
      return backendApi.getProcessingHyperparametersContext(
        await loadOrGenerateProjectId(),
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
    mutationFn: async ({
      dataset,
      body,
      hyperparameterType,
    }: {
      dataset?: string;
      body: Record<string, unknown>;
      hyperparameterType: ProcessingType;
    }) => {
      return backendApi.putProcessingContext(
        await loadOrGenerateProjectId(),
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
    mutationFn: async (params: { dataset?: string; body: string }) => {
      return backendApi.putContext(
        await loadOrGenerateProjectId(),
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
