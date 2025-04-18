import { CsvData, DataDistributions, ParsedDataset } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Papa from "papaparse";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Processa i dati del CSV, convertendo i valori booleani, array e oggetti.
 * @param data - Array di oggetti rappresentanti le righe del CSV.
 * @returns Array di oggetti elaborati.
 */
export const processDataset = (data: CsvData[]): ParsedDataset[] => {
  return data.map((row) => {
    const updatedRow: ParsedDataset = {};
    Object.keys(row).forEach((key) => {
      let value: string | boolean = row[key]; // Assicura che value sia una stringa o un booleano.

      // Converte i valori booleani
      value = parseBoolean(value);
      if (typeof value === "boolean") {
        updatedRow[key] = value;
        return;
      }

      // Specifico per "distribution"
      if (key === "distribution") {
        updatedRow[key] = parseDistributionField(value as string);
        return;
      }

      // Converte stringhe in array/oggetti, se necessario
      if (typeof value === "string") {
        const parsedValue = parseDatasetString(value);
        updatedRow[key] = parsedValue;
      }
    });
    return updatedRow;
  });
};

/**
 * Parsa il campo "distribution"
 */
export const parseDistributionField = (value: string): DataDistributions => {
  return JSON.parse(value);
};

export const parseDatasetString = (value: string) => {
  if (value.trim() === "") {
    return "-";
  }
  const number = Number(value);
  // Se il valore non è un numero, ritorna il valore originale
  // se no lo ritorno come numero a 3 decimali
  if (!isNaN(number)) {
    if (Number.isInteger(number)) {
      return number;
    }

    // Altrimenti, ritorna il numero arrotondato a 3 decimali
    return parseFloat(number.toFixed(3));
  }

  // Rimuovi gli spazi bianchi
  const trimmedValue = value.trim();

  // Verifica se è una stringa che rappresenta un array
  if (trimmedValue.startsWith("[") && trimmedValue.endsWith("]")) {
    try {
      // Pre-processamento: sostituire gli apici singoli con quelli doppi (per array)
      const correctedValue = trimmedValue.replace(/'/g, '"');
      return JSON.parse(correctedValue); // Prova a parsare come array
    } catch (e) {
      console.error("Errore nel parsing dell'array:", e);
      return value; // In caso di errore, ritorna il valore originale
    }
  }

  // Verifica se è una stringa che rappresenta un oggetto
  if (trimmedValue.startsWith("{") && trimmedValue.endsWith("}")) {
    try {
      // Pre-processamento: sostituire gli apici singoli con quelli doppi (per oggetti)
      let correctedValue = trimmedValue.replace(/'/g, '"');
      // Inoltre, per evitare errori specifici con oggetti, correggi anche il formato
      correctedValue = correctedValue.replace(/([a-zA-Z0-9]+):/g, '"$1":'); // Aggiunge le virgolette alle chiavi

      return JSON.parse(correctedValue); // Prova a parsare come oggetto
    } catch (e) {
      console.error("Errore nel parsing dell'oggetto:", e);
      return value; // In caso di errore, ritorna il valore originale
    }
  }

  return value; // Se non è né array né oggetto, ritorna il valore originale
};

// Funzione per convertire "True" / "False" in valori booleani
export const parseBoolean = (value: string) => {
  if (value === "True") {
    return true;
  } else if (value === "False") {
    return false;
  }
  return value; // Se non è un valore booleano, ritorna il valore originale
};

export const parseFeatureKey = (featureKey: string) =>
  featureKey

    .replace(/([a-z])([A-Z])/g, "$1 $2") // Aggiunge uno spazio tra lettere minuscole e maiuscole
    .toLowerCase() // Converte tutto in minuscolo
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Rende la prima lettera di ogni parola maiuscola

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const convertCSVToString = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (result) => {
        // Converte il risultato in stringa CSV
        const csvString = Papa.unparse(result.data);
        resolve(csvString);
      },
      error: (error) => reject(error),
    });
  });
};
