import { ApiResponse } from "apisauce";
// import { getSnapshot } from "mobx-state-tree";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import { getLastActivitiesResult, checkinResult, faceVerifyResult } from "./api.types";
// import { AuthenticationStoreModel, createEnvironment, withEnvironment } from "../../models";
// import { Environment } from "../../models/extensions/environment";
export class TimesheetsApi {
  private api: Api
  constructor(api: Api) {
    this.api = api
  }

  async getLastActivities(tenantId: string): Promise<getLastActivitiesResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`tenant/${tenantId}/timesheets`)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        const result = response['response']['data']
        if (problem) return result
      }
      const places: object = response.data
      return { kind: "ok", result: places }
    }
    catch {
      return { kind: "bad-data" }
    }
  }
  async checkIn(tenantId: string, data: object): Promise<checkinResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post(`tenant/${tenantId}/timesheets/checkin`, data)
      // console.log(response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        const result = response['response']['data']
        console.log("response",response)
        if (problem) return result
      }
      const checkin: object = response.data
      return { kind: "ok", result: checkin }
    }
    catch {
      // console.log(response)
      return { kind: "bad-data" }
    }
  }
  async faceVerify(tenantId: string, data: object): Promise<faceVerifyResult> {
    try{
      const face: ApiResponse<any> = await this.api.apisauce.post(`tenant/${tenantId}/timesheets/face-verify`, data)
      if (!face.ok) {
        const problem = getGeneralApiProblem(face)
        const result = face['response']['data']
        console.log("face",face)
        if (problem) return result
      }
      const checkin: object = face.data
      return { kind: "ok", result: checkin }
    }
    catch {
      // console.log(face)
      return { kind: "bad-data" }
    }
  }
}