export const QuestionnaireBanner = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="flex space-x-4 items-center justify-center p-3 bg-primary-600 text-primary-50 rounded-t-md">
    {children}
  </div>
);
