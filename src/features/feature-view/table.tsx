import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

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

export const FeatureViewTable = ({
  columns,
  data,
  selectedRows,
  handleSelectRow,
  handleCheckboxChange,
  disabled = false,
}: {
  columns: string[];
  data: ParsedDataset[];
  handleSelectRow: (index: number) => void;
  selectedRows?: number[];
  handleCheckboxChange?: (index: number, key: string) => void;
  disabled?: boolean;
}) => {
  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-neutral-50">
        <TableRow>
          <TableHead className="text-center bg-neutral-50 text-neutral-400 border-b-2 border-neutral-200 px-6 border-r-2"></TableHead>
          {columns.map((key, colIndex) => (
            <TableHead
              key={key}
              id={key}
              className={`text-center bg-neutral-100 text-neutral-400 border-b-2 border-neutral-200 px-6 ${
                key === TARGET && "!bg-primary-950 !text-white !px-0 !w-16"
              } ${
                key === SENSITIVE && "!bg-primary-900 !text-white !w-16 !px-0"
              } 
                  ${key === DISTRIBUTION && "!w-[600px]"}
                ${colIndex !== columns.length - 1 && "border-r-2"}
                `}
            >
              {key}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell className="font-medium text-sm  border-b-2 border-r-2 bg-neutral-100 text-neutral-600 !border-neutral-200">
              <Checkbox
                checked={selectedRows?.includes(rowIndex)}
                onCheckedChange={() => handleSelectRow(rowIndex)}
                disabled={disabled}
                className="ml-1.5"
                variant="outlined-black"
              />
            </TableCell>
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
                  {col === TARGET || col === SENSITIVE ? (
                    <Checkbox
                      checked={row[col] as boolean}
                      onCheckedChange={() =>
                        handleCheckboxChange &&
                        handleCheckboxChange(rowIndex, col)
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
        ))}
      </TableBody>
    </Table>
  );
};
