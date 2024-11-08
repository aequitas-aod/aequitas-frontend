import { PropsWithChildren } from "react";

type QuestionnaireContentProps = PropsWithChildren<{
  action: React.ReactNode;
}>;

export const QuestionnaireContent = ({
  children,
  action,
}: QuestionnaireContentProps) => {
  return (
    <>
      <div
        className="flex flex-col flex-1 border h-full rounded-md bg-indigo-50"
        id="content"
      >
        {children}
      </div>
      <div className="flex justify-end p-4">{action}</div>
    </>
  );
};
