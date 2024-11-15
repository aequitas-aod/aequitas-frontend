import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const parseArrayOrObject = (value: string) => {
  const number = Number(value);
  // Se il valore non è un numero, ritorna il valore originale
  // se no lo ritorno come numero a 3 decimali
  if (!isNaN(number)) {
    return number.toFixed(3);
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
