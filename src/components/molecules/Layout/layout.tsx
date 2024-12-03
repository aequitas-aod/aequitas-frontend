import { PropsWithChildren } from "react";

type QuestionnaireContentProps = PropsWithChildren<{
  action: React.ReactNode; // Bottone o azione passata come prop
  className?: string;
  classNameWrapper?: string;
}>;

export const QuestionnaireLayout = ({
  children,
  action,
  className = "",
  classNameWrapper = "",
}: QuestionnaireContentProps) => {
  return (
    <div
      className={`flex flex-col h-full gap-4 ${classNameWrapper}`}
      id="questionnaire-content"
    >
      {/* Contenitore scrollabile */}
      <div
        className={`flex flex-col flex-1 overflow-y-auto border rounded-md bg-primary-50 ${className}`}
      >
        {children}
      </div>

      {/* Contenitore bottone "Continue" */}
      <div className="flex justify-end mt-4">{action}</div>
    </div>
  );
};
