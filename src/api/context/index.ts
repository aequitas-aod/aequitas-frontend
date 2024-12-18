import { useMutation, useQuery } from "@tanstack/react-query";
import { BackendApi } from "../api";
import {
  FeaturesResponse,
  MetricsResponse,
  PreprocessingHyperparametersResponse,
  ProxyDataParams,
  ProxyDataResponse,
} from "../types";
import { PROJECT_CODE } from "@/config/constants";

const backendApi = new BackendApi();

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
      dataset: string;
      body: ProxyDataParams;
    }) => {
      return backendApi.putSuggestedProxies(PROJECT_CODE, dataset, "proxies", body);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};

// dataset view
export const useDatasetContext = (dataset: string) => {
  const query = useQuery<string>({
    queryKey: ["dataset", dataset],
    queryFn: async () => {
      return backendApi.getContextCsv(PROJECT_CODE, dataset, "dataset_head");
    },
  });
  return query;
};

// features-view
export const useStatsContext = (dataset: string) => {
  const query = useQuery<string>({
    queryKey: ["stats", dataset],
    queryFn: async () => {
      return backendApi.getContextCsv(PROJECT_CODE, dataset, "stats");
    },
  });
  return query;
};

// detection view
export const useFeaturesContext = (dataset: string) => {
  const query = useQuery<FeaturesResponse>({
    queryKey: ["features", dataset],
    queryFn: async () => {
      return backendApi.getFeaturesContext(PROJECT_CODE, dataset, "features");
    },
  });
  return query;
};
export const useMetricsContext = (dataset: string) => {
  const query = useQuery<MetricsResponse>({
    queryKey: ["metrics", dataset],
    queryFn: async () => {
      return backendApi.getMetricsContext(PROJECT_CODE, dataset, "metrics");
    },
  });
  return query;
};

// dependencies
export const useSuggestedProxies = (dataset: string) => {
  const query = useQuery<ProxyDataResponse>({
    queryKey: ["suggested-proxies", dataset],
    queryFn: async () => {
      return backendApi.getSuggestedProxies(PROJECT_CODE, dataset, "suggested_proxies");
    },
  });
  return query;
};

export const useCorrelationMatrix = (dataset: string) => {
  const query = useQuery<string>({
    queryKey: ["correlation-matrix", dataset],
    queryFn: async () => {
      return backendApi.getContextVectorialData(PROJECT_CODE, dataset, "correlation_matrix");
    },
  });
  return query;
};

export const useDependencyGraph = (dataset: string) => {
  const query = useQuery<string>({
    queryKey: ["dependency-graph", dataset],
    queryFn: async () => {
      return backendApi.getContextVectorialData(PROJECT_CODE, dataset, "dependency_graph");
    },
  });
  return query;
};

// data-mitigation
export const usePreprocessingHyperparameters = (dataset: string) => {
  const query = useQuery<PreprocessingHyperparametersResponse>({
    queryKey: ["preprocessing-hyperparameters", dataset],
    queryFn: async () => {
      return backendApi.getPreprocessingHyperparametersContext(
        PROJECT_CODE,
        dataset,
        "preprocessing-hyperparameters"
      );
    },
  });
  return query;
};

export const useLaunchAlgorithmMutation = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => {
      return backendApi.putContext(PROJECT_CODE, "launch-algorithm", body);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};
