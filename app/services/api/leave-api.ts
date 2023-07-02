import { ApiResponse } from "apisauce";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import {CreateAbsenceResult} from "./api.types"
export class LeaveApi {
    private api:Api
    constructor (api:Api) {
        this.api=api
    }
  async createLeave (tenantId:string,reason:object,date_start:number,time_start:number,time_end:number,recipients,approvers,shift_current:object):Promise<CreateAbsenceResult> { // tao don xin nghi
    try {
        const response :ApiResponse<any> = await this.api.apisauce.post(`tenant/${tenantId}/laters`,{reason,date_start,time_start,time_end,recipients,approvers,shift_current})
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