import { sleep } from "@/lib/utils";
import {
  FeaturesResponse,
  MetricsResponse,
  PreprocessingHyperparametersResponse,
  ProxyDataParams,
  ProxyDataResponse,
  QuestionnaireResponse,
} from "./types";
import { DeleteQuestionnaireParams, PutQuestionnaireParams, QuestionnaireParams } from "./questionnaire/types";
import axios from "axios";
import { BACKEND_URL } from "@/config/constants";

// Handle the response data
export class BackendApi {
  /* Questionnaire */

  async getQuestionnaire(
    params: QuestionnaireParams
  ): Promise<QuestionnaireResponse> {
    const { n } = params;
    const res = await axios.get(`http://${BACKEND_URL}/projects/p-1/questionnaire/${n}`)
    if (res.status === 200) {
      console.log("RESPONSE", res.data);
      return res.data;
    }
    throw new Error("Failed to fetch questionnaire");
    // await sleep(500);
    // console.log(`GET /projects/{project-name}/questionnaire/${n}`);
    // return require(`../../mocks/questionnaire/${n}.json`);
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
}

export const backendApi = new BackendApi();
