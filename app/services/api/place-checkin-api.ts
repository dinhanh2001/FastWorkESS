import { ApiResponse } from "apisauce";
// import { getSnapshot } from "mobx-state-tree";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import { GetPlacesResult } from "./api.types";
// import { AuthenticationStoreModel, createEnvironment, withEnvironment } from "../../models";
// import { Environment } from "../../models/extensions/environment";
export class PlacesApi {
  private api: Api
  constructor(api: Api) {
    this.api = api
  }

  async getPlaces(tenantId: string): Promise<GetPlacesResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`tenant/${tenantId}/places`)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        const result = response['response']['data']
        if (problem) return result
      }
      const places: Array<object> = response.data
      return { kind: "ok", result: places }
    }
    catch {
      return { kind: "bad-data" }
    }
  }
}