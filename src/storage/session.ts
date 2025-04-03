import { generate as uuid } from "short-uuid";

const KEY = "aequitas.projectId";

const generateProjectId = () => {
  let id = uuid();
  console.log("Generated new project id:", id);
  return id;
};

export const loadOrGenerateProjectId = () => {
  let id: string = sessionStorage.getItem(KEY);
  if (!id) {
    id = generateProjectId();
    sessionStorage.setItem(KEY, id);
  }
  return id;
};

export const resetProjectId = () => {
  sessionStorage.removeItem(KEY);
};
