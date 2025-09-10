import { TableRow, TableBody, TableCell, Table } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ParsedDataset, DataDistributions } from "@/types/types";
import {
  TARGET_COLUMN,
  TRUNCATE_TEXT,
  SENSITIVE_COLUMN,
  DISTRIBUTION_COLUMN,
  FEATURE_COLUMN,
} from "@/config/constants";
import { FeatureViewTableHeader } from "./table-header";
import { Histogram } from "@/components/molecules/Histogram/Histogram";

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
  const convertDistributionsInHistogramData = (
    data: DataDistributions
  ): Record<string, number> => {
    const keys: string[] = data.keys;
    const values: number[] = data.values;
    const chartData: Record<string, number> = {};

    for (const [index, key] of keys.entries()) {
      chartData[key] = values[index];
    }
    return chartData;
  };
  return (
    <Table>
      <FeatureViewTableHeader columns={columns} showSelectRow={showSelectRow} />
      <TableBody>
        {data.map((row, rowIndex) => {
          const isRowSelected = selectedRows?.includes(rowIndex);
          return (
            <TableRow
              key={rowIndex}
              className={`transition-opacity ${
                disabled ? "opacity-50" : !isRowSelected && "opacity-10"
              }`}
            >
              {showSelectRow && (
                <TableCell className="z-11 font-medium text-sm border-b-2 border-r-2 bg-neutral-100 text-neutral-600 !border-neutral-200">
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
                  col !== FEATURE_COLUMN &&
                  col !== TARGET_COLUMN &&
                  col !== SENSITIVE_COLUMN &&
                  col !== DISTRIBUTION_COLUMN;

                const displayedContent = isTruncated
                  ? `${cellContent.slice(0, TRUNCATE_TEXT)}...`
                  : cellContent;

                return (
                  <TableCell
                    key={col}
                    className={`bg-neutral-50 font-medium text-sm text-primary-950 border-b-2 px-6
                      ${colIndex === 0 ? "sticky left-0 z-1" : ""}
                      ${col === TARGET_COLUMN && "!bg-primary-200"} 
                      ${col === SENSITIVE_COLUMN && "!bg-primary-300"}
                      ${colIndex !== columns.length - 1 && "border-r-2"}
                      ${col === DISTRIBUTION_COLUMN && "!px-1"}
                      ${(typeof row[col] === "number" || row[col] === "-") && "!text-right"}
                      ${typeof row[col] === "boolean" && "!text-center"}
                    `}
                    id={col}
                    title={isTruncated ? cellContent : ""}
                  >
                    {col === TARGET_COLUMN ? (
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
                    ) : col === SENSITIVE_COLUMN ? (
                      <Checkbox
                        checked={row[col] as boolean}
                        onCheckedChange={() =>
                          handleSensitiveCheckboxChange &&
                          handleSensitiveCheckboxChange(rowIndex, col)
                        }
                        disabled={row["type"] === "list" ? true : disabled}
                        className="mr-4"
                        variant="outlined-black"
                      />
                    ) : col === DISTRIBUTION_COLUMN ? (
                      <Histogram
                        data={convertDistributionsInHistogramData(
                          row[col] as DataDistributions
                        )}
                      />
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
