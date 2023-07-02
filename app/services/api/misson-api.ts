import { ApiResponse } from "apisauce";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import {CreateAbsenceResult} from "./api.types"
export class MissonApi {
    private api:Api
    constructor (api:Api) {
        this.api=api
    }
  async createMisson (tenantId:string,date_start:number,date_end:number,address:string,missons,recipients,approvers,members):Promise<CreateAbsenceResult> { // tao don cong tac
    try {
        const response :ApiResponse<any> = await this.api.apisauce.post(`tenant/${tenantId}/missons`,{date_start,date_end,address,missons,recipients,approvers,members})
        if(!response) {
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        console.log(response.data)
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