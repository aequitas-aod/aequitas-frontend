import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type ButtonLoadingProps = {
  isLoading: boolean;
} & React.ComponentProps<typeof Button>;

export const ButtonLoading = ({ isLoading, ...props }: ButtonLoadingProps) => {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="animate-spin" />}
      {props.children}
    </Button>
  );
};
