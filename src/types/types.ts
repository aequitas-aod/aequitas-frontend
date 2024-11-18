export type CsvData = {
  [key: string]: string;
};

export type ParsedDataset = {
  [key: string]: string | boolean | string[] | Record<string, number>;
};

export type Dataset = {
  [key: string]: string;
};
