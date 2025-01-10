import { TableRow, TableBody, TableCell, Table } from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { Histogram } from "@/components/molecules/Histogram/Histogram";
import { ParsedDataset } from "@/types/types";
import {
  TARGET,
  TRUNCATE_TEXT,
  SENSITIVE,
  DISTRIBUTION,
  FEATURE_NAME,
} from "@/config/constants";
import { FeatureViewTableHeader } from "./table-header";

type FeatureViewTableProps = {
  columns: string[];
  data: ParsedDataset[];
  selectedRows?: number[];
  handleSelectRow?: (index: number) => void;
  handleTargetCheckboxChange?: (index: number, key: string) => void;
  handleSensitiveCheckboxChange?: (index: number, key: string) => void;
  disabled?: boolean;
};

export const FeatureViewTable = ({
  columns,
  data,
  selectedRows,
  handleSelectRow,
  handleTargetCheckboxChange,
  handleSensitiveCheckboxChange,
  disabled = false,
}: FeatureViewTableProps) => {
  const showSelectRow = !!selectedRows && !!handleSelectRow;
  return (
    <Table>
      <FeatureViewTableHeader columns={columns} showSelectRow={showSelectRow} />
      <TableBody>
        {data.map((row, rowIndex) => {
          // Controlla se la riga è selezionata
          const isRowSelected = selectedRows?.includes(rowIndex);
          return (
            <TableRow
              key={rowIndex}
              // Applica la classe "opacity-50" se la riga non è selezionata
              className={`transition-opacity ${!isRowSelected ? "opacity-20" : ""}`}
            >
              {showSelectRow && (
                <TableCell className="font-medium text-sm border-b-2 border-r-2 bg-neutral-100 text-neutral-600 !border-neutral-200">
                  <Checkbox
                    checked={isRowSelected}
                    onCheckedChange={() => handleSelectRow(rowIndex)}
                    disabled={disabled}
                    className="ml-1.5"
                    variant="outlined-black"
                  />
                </TableCell>
              )}
              {columns.map((col, colIndex) => {
                const cellContent = Array.isArray(row[col])
                  ? row[col].join(", ")
                  : row[col]?.toString() || "";

                const isTruncated =
                  cellContent.length > TRUNCATE_TEXT &&
                  col !== FEATURE_NAME &&
                  col !== TARGET &&
                  col !== SENSITIVE &&
                  col !== DISTRIBUTION;

                const displayedContent = isTruncated
                  ? `${cellContent.slice(0, TRUNCATE_TEXT)}...`
                  : cellContent;

                return (
                  <TableCell
                    key={col}
                    className={`bg-neutral-50 font-medium text-sm text-primary-950 border-b-2 px-6 ${
                      col === TARGET && "!bg-primary-200"
                    } 
                      ${col === SENSITIVE && "!bg-primary-300"}
                      ${colIndex !== columns.length - 1 && "border-r-2"}
                      ${col === DISTRIBUTION && "!px-1"}

                      ${(typeof row[col] === "number" || row[col] === "-") && "!text-right"}
                      ${typeof row[col] === "boolean" && "!text-center"}
                    `}
                    id={col}
                    title={isTruncated ? cellContent : ""}
                  >
                    {col === TARGET ? (
                      <Checkbox
                        checked={row[col] as boolean}
                        onCheckedChange={() =>
                          handleTargetCheckboxChange &&
                          handleTargetCheckboxChange(rowIndex, col)
                        }
                        disabled={disabled}
                        className="mr-4"
                        variant="outlined-black"
                      />
                    ) : col === SENSITIVE ? (
                      <Checkbox
                        checked={row[col] as boolean}
                        onCheckedChange={() =>
                          handleSensitiveCheckboxChange &&
                          handleSensitiveCheckboxChange(rowIndex, col)
                        }
                        disabled={disabled}
                        className="mr-4"
                        variant="outlined-black"
                      />
                    ) : col === DISTRIBUTION ? (
                      <Histogram data={row[col] as Record<string, number>} />
                    ) : (
                      displayedContent
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
