export const QuestionnaireBanner = ({
  children,
  text,
}: {
  children?: React.ReactNode;
  text: string;
}) => (
  <div className="flex items-center justify-between p-3 bg-primary-600 text-primary-50 rounded-t-md gap-2">
    <span className="text-left">{text}</span>
    <div>{children}</div>
  </div>
);
