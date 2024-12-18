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
import axios from "axios";
import { BACKEND_URL } from "@/config/constants";

// Handle the response data
export class BackendApi {
  /* Questionnaire */

  async getQuestionnaireList(
    project: string,
  ): Promise<QuestionnaireResponse[]> {
    const res = await axios.get(
      `http://${BACKEND_URL}/projects/${project}/questionnaire`
    );
    if (res.status === 200) {
      console.log("RESPONSE", res.data);
      return res.data;
    }
    throw new Error("Failed to fetch questionnaire");
  }

  async getQuestionnaireById(
    project: string,
    params: QuestionnaireParams
  ): Promise<QuestionnaireResponse> {
    const { n } = params;
    const res = await axios.get(
      `http://${BACKEND_URL}/projects/${project}/questionnaire/${n}`
    );
    if (res.status === 200) {
      console.log("RESPONSE", res.data);
      return res.data;
    }
    throw new Error("Failed to fetch questionnaire");
  }

  async putQuestionnaire(
    project: string,
    params: PutQuestionnaireParams
  ): Promise<void> {
    const { n, answer_ids } = params;
    console.log(`PUT /projects/${project}/questionnaire/${n}`);
    console.log(params);
    const res = await axios.put(
      `http://${BACKEND_URL}/projects/${project}/questionnaire/${n}`,
      { answer_ids }
    );
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
  }

  async deleteQuestionnaire(
    project: string,
    params: DeleteQuestionnaireParams
  ): Promise<void> {
    const { n } = params;
    const res = await axios.delete(
      `http://${BACKEND_URL}/projects/${project}/questionnaire/${n}`
    );
    if (res.status === 200) {
      console.log("DELETE SUCCESS");
    } else {
      console.log("DELETE FAILED");
    }
  }

  /* Context */

  // Per ottenere le informazioni sui datasets disponibili.

  async getDatasetInfo(): Promise<AnswerContextResponse[]> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=datasets`);
    return require(`../../mocks/datasets/index.json`);
  }

  async getSuggestedProxies(
    project: string,
    dataset: string,
    key: string
  ): Promise<ProxyDataResponse> {
    await sleep(500);
    console.log(`GET /projects/${project}/proxies?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async putSuggestedProxies(
    project: string,
    dataset: string,
    key: string,
    body: ProxyDataParams
  ): Promise<void> {
    console.log(`PUT /projects/{project-name}/proxies?key=${key}__${dataset}`);
    console.log(body);
    const res = await axios.put(
      `http://${BACKEND_URL}/projects/${project}/proxies?key=${key}__${dataset}`,
      body
    );
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
  }

  async getContextCsv(project: string, dataset: string, key: string): Promise<string> {
    const res = await axios.get(
      `http://${BACKEND_URL}/projects/${project}/context?key=${key}__${dataset}`
    );
    if (res.status === 200) {
      console.log("RETRIEVED CSV");
      return res.data;
    }
    throw new Error("Failed to fetch context");
  }

  async getContextVectorialData(
    project: string,
    dataset: string,
    key: string
  ): Promise<string> {
    await sleep(500);
    console.log(`GET /projects/${project}/context?key=${key}__${dataset}`);
    const csvData = (await import(`../../mocks/${key}/${dataset}.ts`)).default;
    return csvData;
  }

  async getFeaturesContext(
    project: string,
    dataset: string,
    key: string
  ): Promise<FeaturesResponse> {
    await sleep(500);
    console.log(`GET /projects/${project}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async getMetricsContext(
    project: string,
    dataset: string,
    key: string
  ): Promise<MetricsResponse> {
    await sleep(500);
    console.log(`GET /projects/${project}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async getPreprocessingHyperparametersContext(
    project: string,
    dataset: string,
    key: string
  ): Promise<PreprocessingHyperparametersResponse> {
    await sleep(500);
    console.log(`GET /projects/${project}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async getContext(
    project: string,
    dataset: string,
    key: string
  ): Promise<Record<string, unknown>> {
    await sleep(500);
    console.log(`GET /projects/${project}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async putContext(
    project: string,
    key: string,
    body: Record<string, unknown>
  ): Promise<void> {
    const res = await axios.put(
      `http://${BACKEND_URL}/projects/${project}/proxies?key=${key}`,
      body
    );
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
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
