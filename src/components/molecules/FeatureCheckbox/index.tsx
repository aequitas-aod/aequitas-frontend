import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

interface FeatureCheckboxProps {
  attributeKey: string; // Chiave dell'attributo
  featureIndex: number; // Indice della feature
  featureKey: string; // Chiave della feature
  onCheckboxChange: (featureKey: string, attributeKey: string) => void; // Funzione per gestire il cambiamento della checkbox
  label?: ReactNode; // Etichetta opzionale da mostrare accanto alla checkbox
  totalItems: number; // Numero totale di elementi
  selectionStatus: string; // Stato della selezione (ad esempio "true" o "false")
  title: string; // Titolo della feature
  disabled?: boolean; // Se la checkbox è disabilitata
}

export const FeatureCheckbox = ({
  attributeKey,
  featureIndex,
  featureKey,
  onCheckboxChange,
  totalItems,
  label,
  selectionStatus,
  title,
  disabled,
}: FeatureCheckboxProps) => {
  // Determina l'altezza dell'elemento in base alla posizione (ultimo elemento o no)
  const itemHeight =
    featureIndex === totalItems - 1 ? "h-[27.5px]" : "h-[55px]";
  const align = featureIndex === totalItems - 1 ? "items-end" : "items-center";

  return (
    <div className="flex items-center relative">
      {/* Linea verticale a sinistra per separare */}
      <div className={`border-l ${itemHeight} border-black flex ${align}`}>
        <div className="w-[34px] h-[1px] bg-black"></div>
      </div>
      <div
        className={`absolute ${
          featureIndex === totalItems - 1
            ? "bottom-[-10px] transform left-9"
            : "top-1/2 transform -translate-y-1/2 left-9"
        }`}
      >
        {/* Checkbox posizionata a sinistra, allineata alla linea verticale */}
        <Checkbox
          checked={selectionStatus === "true"} // Controlla se la selezione è attiva
          onCheckedChange={() => onCheckboxChange(featureKey, attributeKey)} // Gestisce il cambiamento della selezione
          variant="outlined-black"
          className="mr-2 mt-1"
          disabled={disabled}
        />
      </div>
      <div
        className={`absolute ${
          featureIndex === totalItems - 1
            ? "bottom-[-8px] transform left-16"
            : "top-1/2 transform -translate-y-1/2 left-16"
        }`}
      >
        {/* Etichetta o testo della feature */}
        <div className="mt-1 flex gap-2">
          <p className={`font-extrabold ${disabled && "text-gray-500"}`}>
            {title}
          </p>
          {label && <p>{`${label}`}</p>} {/* Mostra l'etichetta se presente */}
        </div>
      </div>
    </div>
  );
};
