import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

import {
  TARGET_COLUMN,
  SENSITIVE_COLUMN,
  DISTRIBUTION_COLUMN,
} from "@/config/constants";

export const FeatureViewTableHeader = ({
  columns,
  showSelectRow = false,
}: {
  columns: string[];
  showSelectRow?: boolean;
}) => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-neutral-50">
      <TableRow>
        {showSelectRow && (
          <TableHead className="text-center bg-neutral-50 text-neutral-400 border-b-2 border-neutral-200 px-6 border-r-2"></TableHead>
        )}
        {columns.map((key, colIndex) => (
          <TableHead
            key={key}
            id={key}
            className={`text-center bg-neutral-100 text-neutral-400 border-b-2 border-neutral-200 px-6 ${
              key === TARGET_COLUMN && "!bg-primary-950 !text-white !px-0 !w-16"
            } ${key === SENSITIVE_COLUMN && "!bg-primary-900 !text-white !w-16 !px-0"} 
                    ${key === DISTRIBUTION_COLUMN && "!w-[600px]"}
                  ${colIndex !== columns.length - 1 && "border-r-2"}
                  `}
          >
            {key}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
