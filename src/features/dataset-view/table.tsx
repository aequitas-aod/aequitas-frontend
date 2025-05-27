import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParsedDataset } from "@/types/types";
import { TRUNCATE_TEXT } from "@/config/constants";
import { useDatasetType } from "@/api/context";

export const DatasetViewTable = ({
  data,
  columns,
}: {
  data: ParsedDataset[];
  columns: string[];
}) => {
  const { data: datasetType } = useDatasetType();
  console.log("Dataset Type:", datasetType);

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-neutral-50">
        <TableRow className="h-14">
          {columns.map((column, index) => (
            <TableHead
              key={index}
              className={`min-w-30 bg-neutral-100 text-center text-neutral-600 border-b-2
                
                    ${index !== columns.length - 1 ? "border-r-2" : ""}`}
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="bg-neutral-50 text-primary-950">
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex} className="border-b">
            {columns.map((col, colIndex) => {
              const cellContent = Array.isArray(row[col])
                ? row[col].join(", ")
                : row[col]?.toString() || "";

              const isTruncated = cellContent.length > TRUNCATE_TEXT;
              let displayedContent;
              let isImageColumn =
                datasetType === "ImageDatasetType" && colIndex === 0;
              if (isImageColumn) {
                // display image from uri
                displayedContent = (
                  <img
                    loading="lazy"
                    src={cellContent}
                    alt="Dataset Image"
                    className="max-h-[15vh] max-w-full object-cover"
                  />
                );
              } else {
                displayedContent = isTruncated
                  ? `${cellContent.slice(0, TRUNCATE_TEXT)}...`
                  : cellContent;
              }

              return (
                <TableCell
                  key={colIndex}
                  className={`min-h-14 border-b-2 border-neutral-100 py-4 px-4
                  ${(typeof row[col] === "number" || row[col] === "-") && "!text-right"}
                  ${(typeof row[col] === "boolean" || isImageColumn) && "flex justify-center items-center"}
                  ${
                    colIndex !== 0 ? "border-l-2" : ""
                  } ${colIndex !== columns.length - 1 ? "border-r-2" : ""}`}
                  title={isTruncated ? cellContent : ""}
                >
                  {displayedContent}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
