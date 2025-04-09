import { generate as uuid } from "short-uuid";
import { backendApi } from "@/api/api";
import { redirect } from "next/navigation";

const KEY = "aequitas.projectId";

const generateProjectId = () => {
  let id = uuid();
  console.log("Generated new project id:", id);
  return id;
};

export const loadOrGenerateProjectId = async (): Promise<string> => {
  let id: string = sessionStorage.getItem(KEY);
  console.log("PROJECT ID:", id);
  if (id) {
    try {
      await backendApi.getProject(id);
    } catch (error) {
      console.log(error);
      sessionStorage.removeItem(KEY);
      redirect("/en");
    }
  }
  if (!id) {
    console.log(
      "Project ID not found in session storage, generating a new one"
    );
    // Check if stored project ID exists
    id = generateProjectId();
    try {
      const name = `Project ${id}`;
      await backendApi.createProject(id, name);
      sessionStorage.setItem(KEY, id);
      return id;
    } catch (error) {
      console.error("Project creation failed", error);
    }
  }
  return id;
};

export const resetProjectId = () => {
  sessionStorage.removeItem(KEY);
};
