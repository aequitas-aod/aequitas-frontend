// utils/parseAnswerId.ts

export const parseAnswerId = (answerId: string): string => {
  if (answerId.includes("Mitigate")) {
    const parts = answerId.split("Mitigate");
    return `${parts[1]}Mitigation`;
  }
  return answerId;
};

export const parseAnswerIdName = (answerId: string): string => {
  const parts = answerId.split("Mitigation");
  const next = parts[0].slice(0, 1).toUpperCase() + parts[0].slice(1);
  return `${next} Mitigation`;
};

export const parseAnswerIdNameSummary = (answerId: string): string => {
  const parts = answerId.split("Mitigation");
  const next = parts[0].slice(0, 1).toUpperCase() + parts[0].slice(1);
  return `${next}M Summary`;
};
