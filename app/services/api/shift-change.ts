import { ApiResponse } from "apisauce"
// import { getSnapshot } from "mobx-state-tree";
import { Api } from "./api"
import { getGeneralApiProblem } from "./api-problem"
import { ShiftChange } from "./api.types"
// import { AuthenticationStoreModel, createEnvironment, withEnvironment } from "../../models";
// import { Environment } from "../../models/extensions/environment";
export class ShiftChangeApi {
  private api: Api
  constructor(api: Api) {
    this.api = api
  }
  async createShiftChange(
    tenantId: string,
    type_change: string,
    shiftchange: object,
    recipients: object,
    approvers: object,
  ): Promise<ShiftChange> {
    try {
      const response :ApiResponse<any> = await this.api.apisauce.post(`tenant/${tenantId}/shiftchanges`, {
        type_change: type_change,
        shiftchange: shiftchange,
        recipients: recipients,
        approvers: approvers,
      })
      if (!response) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      if (response.status === 201) {
        return { kind: "ok", result: response.data }
      } else {
        return { kind: "ok", result: {message:response.data['message']} }
      }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
