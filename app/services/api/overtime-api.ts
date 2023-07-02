import { ApiResponse } from "apisauce"
// import { getSnapshot } from "mobx-state-tree";
import { Api } from "./api"
import { getGeneralApiProblem } from "./api-problem"
import { Shiftmore } from "./api.types"
// import { AuthenticationStoreModel, createEnvironment, withEnvironment } from "../../models";
// import { Environment } from "../../models/extensions/environment";
export class OvertimeApi {
  private api: Api
  constructor(api: Api) {
    this.api = api
  }
  async createOvertime(
    tenantId: string,
    overtimes,
    recipients,
    desc: string,
    members,
    approvers,
  ): Promise<Shiftmore> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post(
        `tenant/${tenantId}/overtimes`,
        { overtimes, recipients, desc, members, approvers },
      )
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
