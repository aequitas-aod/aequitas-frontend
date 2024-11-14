import { Button } from "@/components/ui/button";
import { QuestionnaireContent } from "@/containers/layout";
import { useTranslations } from "next-intl";
import { Feature, features } from "../../../mocks/3/mock";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export const FeatureViewPage = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("feature-view");

  const [featureData, setFeatureData] = useState<Feature[]>(features);

  const handleCheckboxChange = (index: number, key: string) => {
    console.log(index, key);
    const updatedFeatures = [...featureData]; // Crea una copia dell'array
    const updatedFeature = { ...updatedFeatures[index] }; // Crea una copia dell'oggetto
    updatedFeature[key] = !updatedFeature[key]; // Cambia lo stato del checkbox
    updatedFeatures[index] = updatedFeature; // Sostituisci l'oggetto modificato nell'array
    console.log(updatedFeatures);
    setFeatureData(updatedFeatures); // Imposta il nuovo stato
  };

  const onContinue = () => {
    // call to save data
    onNext();
  };

  // Define the custom column order, ensuring "target" and "sensitive" are at the end
  const columnOrder = Object.keys(features[0])
    .filter((key) => key !== "target" && key !== "sensitive")
    .concat(["sensitive", "target"]);

  return (
    <QuestionnaireContent
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-neutral-50"
    >
      <Table>
        <TableHeader>
          <TableRow>
            {columnOrder.map((key) => (
              <TableHead
                key={key}
                className={`${key === "target" && "!bg-primary-950 !text-white !px-2"} ${key === "sensitive" && "!bg-primary-900 !text-white !px-2"} ${key === "name" && "!bg-neutral-50"} text-center bg-secondary-100 text-neutral-400 px-6 border-l`}
              >
                {key === "name"
                  ? ""
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {featureData.map((feature, index) => (
            <TableRow key={index}>
              {columnOrder.map((key) => (
                <TableCell
                  key={key}
                  className={`${key === "target" && "!bg-primary-200"} ${key === "sensitive" && "!bg-primary-300"} ${key === "name" && "!bg-secondary-100"} text-center bg-neutral-50 border-b`}
                >
                  {/* Display based on value type */}
                  {Array.isArray(feature[key]) ? (
                    key === "histogram" ? (
                      <div style={{ maxHeight: "100px" }}>
                        {/* TODO: chart*/}
                        {feature[key].join(", ")}
                      </div>
                    ) : (
                      feature[key].join(", ")
                    )
                  ) : (key === "target" || key === "sensitive") &&
                    typeof feature[key] === "boolean" ? (
                    <Checkbox
                      checked={feature[key] as boolean}
                      onCheckedChange={() => handleCheckboxChange(index, key)}
                      className="mr-4"
                      variant="outlined-black"
                    />
                  ) : (
                    feature[key]?.toString() || ""
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </QuestionnaireContent>
  );
};
