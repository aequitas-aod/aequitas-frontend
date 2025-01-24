import { v4 as uuidv4 } from 'uuid';


const KEY = 'aequitas.projectId';


const generateProjectId = () => {
  let id = uuidv4();
  console.log('Generated new project id:', id);
  return id;
}

export const loadOrGenerateProjectId = () => {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
        id = generateProjectId();
        sessionStorage.setItem(KEY, id);
    }
    return id;
};

export const resetProjectId = () => {
    sessionStorage.removeItem(KEY);
}
