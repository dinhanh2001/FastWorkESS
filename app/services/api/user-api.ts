import { ApiResponse } from "apisauce";
// import { getSnapshot } from "mobx-state-tree";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import { GetCurrentUser, UpdateProfile, UpdateAvatar  } from "./api.types";
// import { AuthenticationStoreModel, createEnvironment, withEnvironment } from "../../models";
// import { Environment } from "../../models/extensions/environment";
export class UserApi {
  private api: Api
  constructor(api: Api) {
    this.api = api
  }

  async getCurrentUser(tenantId: string): Promise<GetCurrentUser> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(`tenant/${tenantId}/users`)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", result: response }
    }
    catch {
      return { kind: "bad-data" }
    }
  }
  
  async updateProfile(tenantId: string, data: object): Promise<UpdateProfile> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.put(`tenant/${tenantId}/users`, data)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return response.data
      }
      return { kind: "ok", result: response }
    }
    catch {
      return { kind: "bad-data" }
    }
  }

  async updateAvatar(tenantId: string, value: object): Promise<UpdateAvatar> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post(`tenant/${tenantId}/users/avatar?orgid=${tenantId}`, value)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return response.data
      }
      return { kind: "ok", result: response }
    }
    catch {
      return { kind: "bad-data" }
    }
  }
  async registerFireBase (email :string, orgid:string ,cloudid:string ,type:string,appType:string ) {
      try {
        const response:ApiResponse<any> = await this.api.apisauce.post(`auth/cloudId/`,{email , orgid ,cloudid ,type,appType})
        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return response.data
        }
        return { kind: "ok", result: response }
      }
      catch {
        return { kind: "bad-data" }
      }
  }
}