import axios from "axios";

import { sleep } from "@/lib/utils";
import { BACKEND_URL } from "@/config/constants";

import type { ProcessingType } from "@/types/types";
import {
  AnswerContextResponse,
  DetectionDataParams,
  FeaturesParams,
  FeaturesResponse,
  MetricsResponse,
  ProcessingHyperparametersResponse,
  ProxyDataParams,
  ProxyDataResponse,
  QuestionnaireResponse,
} from "./types";
import type {
  DeleteQuestionnaireParams,
  PutQuestionnaireParams,
  QuestionnaireParams,
} from "./questionnaire/types";

// Funzione per verificare se utilizzare i mock
export const isMocked = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCKS === "true";
};

// Handle the response data
export class BackendApi {
  /* Questionnaire */

  async getQuestionnaireList(
    project: string
  ): Promise<QuestionnaireResponse[]> {
    const url = `${BACKEND_URL}/projects/${project}/questionnaire`;
    console.log(`GET URL: ${url}`);
    if (isMocked()) {
      console.log("Using mocked response for getQuestionnaireList");
      return require(`../../mocks/questionnaire/full.json`);
    }
    const res = await axios.get(url);
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
    const url = `${BACKEND_URL}/projects/${project}/questionnaire/${n}`;
    console.log(`GET URL: ${url}`);
    if (isMocked()) {
      console.log("Using mocked response for getQuestionnaireById");
      return require(`../../mocks/questionnaire/${n}.json`);
    }
    const res = await axios.get(url);
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
    const url = `${BACKEND_URL}/projects/${project}/questionnaire/${n}`;
    console.log(`PUT URL: ${url}`);
    console.log(params);
    if (isMocked()) {
      console.log("Using mocked response for putQuestionnaire");
      return;
    }
    const res = await axios.put(url, { answer_ids });
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
  }

  async deleteQuestionnaireById(
    project: string,
    params: DeleteQuestionnaireParams
  ): Promise<void> {
    const { n } = params;
    const url = `${BACKEND_URL}/projects/${project}/questionnaire/${n}`;
    console.log(`DELETE URL: ${url}`);
    if (isMocked()) {
      console.log("Using mocked response for deleteQuestionnaireById");
      return;
    }
    const res = await axios.delete(url);
    if (res.status === 200) {
      console.log("DELETE SUCCESS");
    } else {
      console.log("DELETE FAILED");
    }
  }

  /* Context */

  async getCurrentDataset(project: string): Promise<string> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=current_dataset`;
    console.log(`GET URL: ${url}`);
    if (isMocked()) {
      console.log("Using mocked response for getCurrentDataset");
      return "custom-1";
    }
    const res = await axios.get(url);
    if (res.status === 200) {
      console.log("RETRIEVED CURRENT DATASET");
      return res.data;
    }
    throw new Error("Failed to fetch current dataset");
  }

  async getCurrentTestDataset(project: string): Promise<string> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=test_current_dataset`;
    const res = await axios.get(url);
    if (res.status === 200) {
      console.log("RETRIEVED CURRENT DATASET");
      return res.data;
    }
    throw new Error("Failed to fetch current dataset");
  }

  async getDatasetsInfo(project: string): Promise<AnswerContextResponse[]> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=datasets`;
    console.log(`GET URL: ${url}`);
    if (isMocked()) {
      await sleep(500);
      return require(`../../mocks/datasets/index.json`);
    }
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to fetch datasets info");
  }

  async putFeatures(
    project: string,
    dataset: string,
    body: FeaturesParams
  ): Promise<void> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=features__${dataset}`;
    console.log(`PUT URL: ${url}`);
    console.log(body);
    if (isMocked()) {
      console.log("Using mocked response for putFeatures");
      return;
    }
    const res = await axios.put(url, body);
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
  }

  async getSuggestedProxies(
    project: string,
    dataset: string
  ): Promise<ProxyDataResponse> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=suggested_proxies__${dataset}`;
    console.log(`GET URL: ${url}`);
    if (isMocked()) {
      console.log("Using mocked response for getSuggestedProxies");
      return require(`../../mocks/suggested_proxies/custom-1.json`);
    }
    const res = await axios.get(url);
    if (res.status === 200) {
      console.log("RESPONSE", res.data);
      return res.data;
    }
    throw new Error("Failed to fetch suggested proxies");
  }

  async putProxies(
    project: string,
    dataset: string,
    body: ProxyDataParams
  ): Promise<void> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=proxies__${dataset}`;
    console.log(`PUT URL: ${url}`);
    console.log(body);
    if (isMocked()) {
      console.log("Using mocked response for putProxies");
      return;
    }
    const res = await axios.put(url, body);
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
  }

  async putDetected(
    project: string,
    dataset: string,
    body: DetectionDataParams
  ): Promise<void> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=detected__${dataset}`;
    console.log(`PUT URL: ${url}`);
    console.log(body);
    if (isMocked()) {
      console.log("Using mocked response for putDetected");
      return;
    }
    const res = await axios.put(url, body);
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
  }

  async putProcessingContext(
    project: string,
    dataset: string,
    body: unknown,
    hyperparameterType: ProcessingType
  ): Promise<void> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=${hyperparameterType}__${dataset}`;
    console.log(`PUT URL: ${url}`);
    if (isMocked()) {
      console.log("Using mocked response for putContext");
      await sleep(2000);
      return;
    }
    const res = await axios.put(url, body);
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
  }

  async getContextCsv(
    project: string,
    dataset: string,
    key: string
  ): Promise<string> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=${key}__${dataset}`;
    console.log(`GET URL: ${url}`);
    if (isMocked()) {
      console.log("Using mocked response for getContextCsv");
      console.log(`../../mocks/${key}/${dataset}.ts`);
      const csvData = (await import(`../../mocks/${key}/custom-1.ts`)).default;
      return csvData;
    }
    const res = await axios.get(url);
    if (res.status === 200) {
      console.log("RETRIEVED CSV");
      return res.data;
    }
    throw new Error("Failed to fetch context CSV");
  }

  async getContextVectorialData(
    project: string,
    dataset: string,
    key: string
  ): Promise<string> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=${key}__${dataset}`;

    console.log(`Fetching vectorial data from URL: ${url}`);
    const response = await axios.get<string>(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Failed to fetch vectorial data");
  }

  async getFeaturesContext(
    project: string,
    dataset: string
  ): Promise<FeaturesResponse> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=features__${dataset}`;
    console.log(`GET URL: ${url}`);
    if (isMocked()) {
      return require(`../../mocks/features/${dataset}.json`);
    }
    const res = await axios.get(
      `${BACKEND_URL}/projects/${project}/context?key=features__${dataset}`
    );
    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to fetch context");
  }

  async getMetricsContext(
    project: string,
    dataset: string
  ): Promise<MetricsResponse> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=metrics__${dataset}`;
    console.log(`GET URL: ${url}`);
    if (isMocked()) {
      return require(`../../mocks/metrics/custom-1.json`);
    }
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to fetch context");
  }

  async getProcessingHyperparametersContext(
    project: string,
    algorithm: string,
    hyperparameterType: ProcessingType
  ): Promise<ProcessingHyperparametersResponse> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=${hyperparameterType}-hyperparameters__${algorithm}&timeout=10`;
    console.log(`GET URL: ${url}`);
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to fetch context");
  }

  async getContext(
    project: string,
    dataset: string,
    key: string
  ): Promise<Record<string, unknown>> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=${key}__${dataset}`;
    console.log(`GET URL: ${url}`);
    await sleep(500);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async putContext(project: string, key: string, body: unknown): Promise<void> {
    const url = `${BACKEND_URL}/projects/${project}/context?key=${key}`;
    console.log(`PUT URL: ${url}`);
    if (isMocked()) {
      console.log("Using mocked response for putContext");
      await sleep(2000);
      return;
    }
    const res = await axios.put(url, body);
    if (res.status === 200) {
      console.log("PUT SUCCESS");
    } else {
      console.log("PUT FAILED");
    }
  }
}

export const backendApi = new BackendApi();
