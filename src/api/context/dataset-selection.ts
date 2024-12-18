import { useMutation } from "@tanstack/react-query";
import { backendApi } from "../api";

// PUT /projects/{project-code}/context?key=dataset__custom-1

export const useUpdateContextCsv = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: (params: {
      // project: string;
      dataset: string;
      body: string;
    }) => {
      return backendApi.putContextCsv(
        // params.project,
        "dataset",
        params.dataset,
        params.body
      );
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
  return mutation;
};
