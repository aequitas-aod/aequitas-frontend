import { sleep } from "@/lib/utils";
import { ContextResponse, QuestionnaireResponse } from "./types";

export class BackendApi {
  async getQuestionnaire(n: number): Promise<QuestionnaireResponse> {
    await sleep(1000);
    return JSON.parse(require(`../../mocks/questionnaire/${n}.json`));
  }

  async getContext(key: string): Promise<ContextResponse> {
    await sleep(1000);
    return JSON.parse(require(`../../mocks/context/${key}.json`));
  }

  // todo: add put methods
}
