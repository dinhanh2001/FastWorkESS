import { ApiResponse } from "apisauce";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import { CategoriesResult,ShiftDetail ,GroupOrg} from "./api.types";
export class CategoriesApi {
    private api:Api
    constructor (api:Api) {
        this.api=api
    }
  async getShift (tenantId:string):Promise<CategoriesResult> { // lay ca
    try {
        const response :ApiResponse<any> = 
        await this.api.apisauce.get(`tenant/${tenantId}/category/customers?next=9999&skip=0`)
        if(!response){
        
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        if ( response.status===200 ){
            return { kind:"ok" , result:response.data['result']}
        }
        else {
            return { kind:"bad-data"}
        }
    }catch(e){
        return { kind:"bad-data"}
    }
  }
  async categoriesleave (tenantId:string,type:string):Promise<CategoriesResult> { // lay li do
    try {
        const response :ApiResponse<any> = 
        await this.api.apisauce.get(`tenant/${tenantId}/category/${type}`)
        if(!response){
        
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        if ( response.status===200 ){
            return { kind:"ok" , result:response.data['result']}
        }
        else {
            return { kind:"bad-data"}
        }
    }catch(e){
        return { kind:"bad-data"}
    }
  }
  async getShiftV2 (tenantId:string,fromDate:number,toDate:number,email:string):Promise<CategoriesResult> { //lay ca duoc phan
    try {
        const response :ApiResponse<any> = 
        await this.api.apisauce.get(`tenant/${tenantId}/category/staffshift?from_date=${fromDate}&to_date=${toDate}&email=${email}`)
        if(!response){
        
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        if ( response.status===200 ){
            return { kind:"ok" , result:response.data['result']}
        }
        else {
            return { kind:"bad-data"}
        }
    }catch(e){
        return { kind:"bad-data"}
    }
  }
  async approver (tenantId:string,type:string):Promise<CategoriesResult> { // lay nguoi duyet
    try {
        const response :ApiResponse<any> = 
        await this.api.apisauce.get(`tenant/${tenantId}/category/approvers?type=${type}`)
        if(!response){
        
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        if ( response.status===200 ){
            return { kind:"ok" , result:response.data['result']}
        }
        else {
            return { kind:"bad-data"}
        }
    }catch(e){
        return { kind:"bad-data"}
    }
  }
  async recipients (tenantId:string):Promise<CategoriesResult> { // lay nguoi thong bao
    try {
        const response :ApiResponse<any> = 
        await this.api.apisauce.get(`tenant/${tenantId}/category/OrganizationsGroup?moduleId=news`)
        if(!response){
        
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        if ( response.status===200 ){
            return { kind:"ok" , result:response.data}
        }
        else {
            return { kind:"bad-data"}
        }
    }catch(e){
        return { kind:"bad-data"}
    }
  }
  async shiftDetail (tenantId:string ,type :string ,id :string):Promise<ShiftDetail>{ // chi tiet don
    try {
        const response :ApiResponse<any> = 
        await this.api.apisauce.get(`tenant/${tenantId}/${type}s/${id}`)
        if(!response){
        
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        if ( response.status===200 ){
            return { kind:"ok" , result:response.data}
        }
        else {
            return { kind:"bad-data"}
        }
    }
    catch (e) {
        return { kind:"bad-data"}
    }
  }
  async getOrgGroup (tenantId):Promise<GroupOrg>{
    try{
        const response :ApiResponse<any> = await this.api.apisauce.get(`tenant/${tenantId}//category/OrganizationsGroup?moduleId=news`)
        if(!response){
        
            const problem = getGeneralApiProblem(response)
            if(problem) return problem
        }
        if ( response.status===200 ){
            return { kind:"ok" , result:response.data}
        }
        else {
            return { kind:"bad-data"}
        }
    }
    catch {
        return { kind:"bad-data"}
    }
  }
}