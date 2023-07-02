import { ApiResponse } from "apisauce";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import {CreateAbsenceResult} from "./api.types"
export class AbsenceApi {
    private api:Api
    constructor (api:Api) {
        this.api=api
    }
  async createAbsence (tenantId:string,absence,members,approvers,number_total:number,number_absence:number,number_rest:number,recipients):Promise<CreateAbsenceResult> {
    try {
        const response :ApiResponse<any> = await this.api.apisauce.post(`tenant/${tenantId}/absences`,{absence,members,approvers,number_total,number_absence,number_rest,recipients})
        if(!response) {
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        if(response.status===201){
          return {kind:"ok",result:response.data}
        }else {
          return {kind:"ok",result:[]}
        }
    }   
    catch (e) {
      return {kind:"bad-data"}
    }
  } 
}