import { AnswerResponse } from "@/api/types";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  datasetKey: string;
  answers: AnswerResponse[];
  onAction: (actionId: string) => void;
  onDownloadDataset: () => void;
  onDownloadResults: () => void;
  onTest: () => void;
}

export const ActionButtons = ({
  datasetKey,
  answers,
  onAction,
  onDownloadDataset,
  onDownloadResults,
  onTest,
}: ActionButtonsProps) => {
  return (
    <div className="flex space-x-2">
      {answers.map((answer) => (
        <Button
          key={answer.id.code}
          onClick={() => onAction(answer.id.code)} // Quando cliccato, chiama onAction con l'id dell'azione
          variant="outline"
        >
          {answer.text}
        </Button>
      ))}
      <Button onClick={onDownloadDataset} variant="outline" className="ml-4">
        Download Dataset
      </Button>
      <Button onClick={onDownloadResults} variant="outline">
        Download Results
      </Button>
      <Button onClick={onTest} variant="outline" className="ml-4">
        Test
      </Button>
    </div>
  );
};
