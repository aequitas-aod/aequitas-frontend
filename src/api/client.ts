import { sleep } from "@/lib/utils";
import {
  MetricsResponse,
  ProxyDataParams,
  ProxyDataResponse,
  QuestionnaireResponse,
} from "./types";
import fs from "fs";
import path from "path";

export class BackendApi {
  async getQuestionnaire(n: number): Promise<QuestionnaireResponse> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/questionnaire/${n}`);
    return require(`../../mocks/questionnaire/${n}.json`);
  }

  async getSuggestedProxies(
    dataset: string,
    key: string
  ): Promise<ProxyDataResponse> {
    await sleep(500);
    console.log("GET /projects/{project-name}/proxies");
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

  async getVectorialData(dataset: string, key: string): Promise<string> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=${key}__${dataset}`);
    const csvData = (await import(`../../mocks/${key}/${dataset}.ts`)).default;
    return csvData;
  }

  async getMetricsContext(
    dataset: string,
    key: string
  ): Promise<MetricsResponse> {
    await sleep(500);
    console.log(`GET /projects/{project-name}/context?key=${key}__${dataset}`);
    return require(`../../mocks/${key}/${dataset}.json`);
  }

  async putContext(project: string, contentKey: string): Promise<void> {
    console.log(`PUT /projects/{project-name}/context?key=${contentKey}`);
    await sleep(500);
  }

  async putQuestionnaire(
    n: number,
    body: {
      answer_ids: {
        code: string;
        question_code?: string;
        project_code?: string;
      }[];
    }
  ): Promise<void> {
    console.log(`PUT /projects/{project-name}/questionnaire/${n}`);
    console.log(body);
    await sleep(500);
  }
}
