import { useMutation } from "@tanstack/react-query";
import { backendApi } from "../api";
import { PROJECT_CODE } from "@/config/constants";

// PUT /projects/{project-code}/context?key=dataset__custom-1

export const useUpdateContextCsv = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: (params: {
      dataset: string;
      body: string;
    }) => {
      return backendApi.putContext(
        PROJECT_CODE,
        "dataset__" + params.dataset,
        params.body,
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
