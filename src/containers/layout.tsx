import { PropsWithChildren } from "react";

type QuestionnaireContentProps = PropsWithChildren<{
  action: React.ReactNode; // Bottone o azione passata come prop
  className?: string;
}>;

export const QuestionnaireLayout = ({
  children,
  action,
  className = "",
}: QuestionnaireContentProps) => {
  return (
    <div
      className={`flex flex-col h-full ${className}`}
      id="questionnaire-content"
    >
      {/* Contenitore scrollabile */}
      <div className="flex-1 overflow-y-auto border rounded-md bg-primary-50">
        {children}
      </div>

      {/* Contenitore bottone "Continue" */}
      <div className="flex justify-end border-t bg-white">{action}</div>
    </div>
  );
};
