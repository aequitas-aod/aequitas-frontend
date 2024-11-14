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
    setFeatureData((prevFeatures) => {
      const updatedFeatures = [...prevFeatures];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [key]: !updatedFeatures[index][key],
      };
      return updatedFeatures;
    });
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
            {columnOrder.map((key, colIndex) => (
              <TableHead
                key={key}
                className={`text-center bg-secondary-100 text-neutral-400 border-b-2 border-neutral-200 px-6 ${
                  key === "target" && "!bg-primary-950 !text-white !px-0 !w-16"
                } ${
                  key === "sensitive" &&
                  "!bg-primary-900 !text-white !w-16 !px-0"
                } ${
                  key === "name" && "!bg-neutral-50"
                } ${colIndex !== columnOrder.length - 1 && "border-r-2"}`}
              >
                {key === "name"
                  ? ""
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {featureData.map((feature, rowIndex) => (
            <TableRow key={rowIndex}>
              {columnOrder.map((key, colIndex) => (
                <TableCell
                  key={key}
                  className={`text-center bg-neutral-50 font-medium text-sm text-primary-950 py-10 border-b-2 ${
                    key === "target" && "!bg-primary-200"
                  } ${
                    key === "sensitive" && "!bg-primary-300"
                  } ${key === "name" && "!bg-secondary-100 !text-neutral-600 !border-neutral-200"} ${
                    colIndex !== columnOrder.length - 1 && "border-r-2"
                  }`}
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
                      onCheckedChange={() =>
                        handleCheckboxChange(rowIndex, key)
                      }
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
