import { sleep } from "@/lib/utils";
import {
  AnswerContextResponse,
  FeaturesResponse,
  MetricsResponse,
  PreprocessingHyperparametersResponse,
  ProxyDataParams,
  ProxyDataResponse,
  QuestionnaireResponse,
} from "./types";
import {
  DeleteQuestionnaireParams,
  PutQuestionnaireParams,
  QuestionnaireParams,
} from "./questionnaire/types";

export class BackendApi {
  /* Questionnaire */

  async getQuestionnaireList(): Promise<QuestionnaireResponse[]> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/questionnaire/full`);
    return require(`../../mocks/questionnaire/full.json`);
  }

  async getQuestionnaireById(
    params: QuestionnaireParams
  ): Promise<QuestionnaireResponse> {
    const { n } = params;
    await sleep(500);
    console.log(`GET /projects/{project-name}/questionnaire/${n}`);
    return require(`../../mocks/questionnaire/${n}.json`);
  }

  async putQuestionnaire(params: PutQuestionnaireParams): Promise<void> {
    const { n, answer_ids } = params;
    console.log(`PUT /projects/{project-name}/questionnaire/${n}`);
    console.log(params);
    await sleep(500);
  }

  async deleteQuestionnaire(params: DeleteQuestionnaireParams): Promise<void> {
    const { n } = params;
    console.log(`DELETE /projects/{project-name}/questionnaire/${n}`);
    await sleep(500);
  }

  /* Context */

  // Per ottenere le informazioni sui datasets disponibili.

  async getDatasetInfo(): Promise<AnswerContextResponse[]> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=datasets`);
    return require(`../../mocks/datasets/index.json`);
  }

  async getSuggestedProxies(
    dataset: string,
    key: string
  ): Promise<ProxyDataResponse> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/proxies?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async putSuggestedProxies(
    dataset: string,
    key: string,
    body: ProxyDataParams
  ): Promise<void> {
    console.log(`PUT /projects/{project-name}/proxies?key=${key}__${dataset}`);
    await sleep(500);
  }

  async getContextCsv(dataset: string, key: string): Promise<string> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=${key}__${dataset}`);
    const csvData = (await import(`../../mocks/${key}/${dataset}.ts`)).default;
    return csvData;
  }

  async getContextVectorialData(dataset: string, key: string): Promise<string> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=${key}__${dataset}`);
    const csvData = (await import(`../../mocks/${key}/${dataset}.ts`)).default;
    return csvData;
  }

  async getFeaturesContext(
    dataset: string,
    key: string
  ): Promise<FeaturesResponse> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async getMetricsContext(
    dataset: string,
    key: string
  ): Promise<MetricsResponse> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async getPreprocessingHyperparametersContext(
    dataset: string,
    key: string
  ): Promise<PreprocessingHyperparametersResponse> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async getContext(
    // project: string,
    dataset: string,
    key: string
  ): Promise<Record<string, unknown>> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async putContext(
    project: string,
    contentKey: string,
    body: Record<string, unknown>
  ): Promise<void> {
    console.log(`PUT /projects/{project-name}/context?key=${contentKey}`);
    console.log(body);
    await sleep(500);
  }

  async putContextCsv(
    //project: string,
    key: string,
    dataset: string,
    // body come csv
    body: string
  ): Promise<void> {
    console.log(`PUT /projects/{project-name}/context?key=${key}__${dataset}}`);
    console.log(body);
    await sleep(500);
  }
}

export const backendApi = new BackendApi();
