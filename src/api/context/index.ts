import { useMutation, useQuery } from "@tanstack/react-query";
import { BackendApi } from "../api";
import {
  FeaturesResponse,
  MetricsResponse,
  PreprocessingHyperparametersResponse,
  ProxyDataParams,
  ProxyDataResponse,
} from "../types";

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
      return backendApi.putSuggestedProxies(dataset, "proxies", body);
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
      return backendApi.getContextCsv(dataset, "dataset");
    },
  });
  return query;
};

// features-view
export const useStatsContext = (dataset: string) => {
  const query = useQuery<string>({
    queryKey: ["stats", dataset],
    queryFn: async () => {
      return backendApi.getContextCsv(dataset, "stats");
    },
  });
  return query;
};

// detection view
export const useFeaturesContext = (dataset: string) => {
  const query = useQuery<FeaturesResponse>({
    queryKey: ["features", dataset],
    queryFn: async () => {
      return backendApi.getFeaturesContext(dataset, "features");
    },
  });
  return query;
};
export const useMetricsContext = (dataset: string) => {
  const query = useQuery<MetricsResponse>({
    queryKey: ["metrics", dataset],
    queryFn: async () => {
      return backendApi.getMetricsContext(dataset, "metrics");
    },
  });
  return query;
};

// dependencies
export const useSuggestedProxies = (dataset: string) => {
  const query = useQuery<ProxyDataResponse>({
    queryKey: ["suggested-proxies", dataset],
    queryFn: async () => {
      return backendApi.getSuggestedProxies(dataset, "suggested_proxies");
    },
  });
  return query;
};

export const useCorrelationMatrix = (dataset: string) => {
  const query = useQuery<string>({
    queryKey: ["correlation-matrix", dataset],
    queryFn: async () => {
      return backendApi.getContextVectorialData(dataset, "correlation_matrix");
    },
  });
  return query;
};

export const useDependencyGraph = (dataset: string) => {
  const query = useQuery<string>({
    queryKey: ["dependency-graph", dataset],
    queryFn: async () => {
      return backendApi.getContextVectorialData(dataset, "dependency_graph");
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
      return backendApi.putContext("project", "launch-algorithm", body);
    },
    onSuccess: () => {
      onSuccess();
    },
  });
  return mutation;
};
