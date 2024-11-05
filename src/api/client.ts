import { sleep } from "@/lib/utils";
import { ContextResponse, QuestionnaireResponse } from "./types";

export class BackendApi {
  async getQuestionnaire(n: number): Promise<QuestionnaireResponse> {
    await sleep(1000);
    // GET /projects/{project-name}/questionnaire/{nth}
    return JSON.parse(require(`../../mocks/questionnaire/${n}.json`));
  }

  async getContext(key: string): Promise<ContextResponse> {
    await sleep(1000);
    // GET /projects/{project-name}/context?key=KEY_NAME_HERE
    return JSON.parse(require(`../../mocks/context/${key}.json`));
  }

  async putContext(projectName: string, contentKey: string): Promise<void> {
    // PUT /projects/{project-name}/context?key=KEY_NAME_HERE
    await sleep(1000);
  }

  // todo: add put methods
}
