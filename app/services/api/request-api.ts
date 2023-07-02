import { ApiResponse } from "apisauce";
// import { getSnapshot } from "mobx-state-tree";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import { GetSummary  } from "./api.types";
// import { AuthenticationStoreModel, createEnvironment, withEnvironment } from "../../models";
// import { Environment } from "../../models/extensions/environment";
export class RequestApi {
  private api: Api
  constructor(api: Api) {
    this.api = api
  }
  async getSummary(tenantId:string,fromDate:number,toDate:number,next:number,type?:string,status?:string):Promise<GetSummary> {
        try{   
          let str = (type ? `type=${type}&`:"") +  (status ? `status=${status}&`:"") + `from_date=${fromDate}&to_date=${toDate}&next=${next}&skip=0`
            const response :ApiResponse<any> = await this.api.apisauce.get(`tenant/${tenantId}/summary?`+str)
            if(!response){
                
                const problem = getGeneralApiProblem(response)
                if(problem) return problem
            }
            const summary = response['data']['result']
            if(response.status===200) {
              if(response['data']['result'] !== null){

                return {kind:"ok",result : summary} // neu k loc dc = []
              }
              else {
                return {kind:"ok",result : []}
              }
            }
            else{
              return {kind:"ok",result:[]}
            }
        }
        catch(e) {
            return {kind:"bad-data"}
        }
  }
}