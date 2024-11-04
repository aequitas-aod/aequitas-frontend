import { cn } from "@/lib/utils";
import Image from "next/image";

export type ContentSize = "sm" | "md" | "lg" | "xl";

export interface AequitasLogoImageProps {
  className?: string;
  wFull?: boolean;
  maxW?: ContentSize;
  hFull?: boolean;
}

export const AequitasLogoImage = ({
  className,
  hFull,
  wFull,
  maxW,
}: AequitasLogoImageProps) => {
  return (
    <Image
      className={cn(
        {
          "w-full": wFull,
          "h-full": hFull,
          "max-w-[100px]": maxW === "sm",
          "max-w-[200px]": maxW === "md",
          "max-w-[300px]": maxW === "lg",
          "max-w-[400px]": maxW === "xl",
        },
        className
      )}
      src="/images/aequitas.png"
      alt="Aequitas logo"
      width={100}
      height={100}
    />
  );
};
