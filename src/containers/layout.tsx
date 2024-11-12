import { PropsWithChildren } from "react";

type QuestionnaireContentProps = PropsWithChildren<{
  action: React.ReactNode;
  className?: string;
}>;

export const QuestionnaireContent = ({
  children,
  action,
  className = "",
}: QuestionnaireContentProps) => {
  return (
    <>
      <div
        className={`flex flex-col flex-1 border h-full overflow-auto rounded-md bg-primary-50 ${className}`}
        id="questionnaire-content"
      >
        {children}
      </div>
      <div className="flex justify-end p-4">{action}</div>
    </>
  );
};
