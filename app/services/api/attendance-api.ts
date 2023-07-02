import { ApiResponse } from "apisauce";
import { Api } from "./api";
import { getGeneralApiProblem  } from "./api-problem";
import { GetDataAttendance ,GetDataDayAttendance } from "./api.types";
export class AttendanceApi {
    private api :Api
    constructor (api:Api) {
        this.api=api
    }
    async getDataAttendance (tenantId:string,fromDate:number,toDate:number):Promise<GetDataAttendance>{
        try {
                const response :ApiResponse<any> = 
                await this.api.apisauce.get(`tenant/${tenantId}/attendances?from_date=${fromDate}&to_date=${toDate}`)
                if(!response){
                
                    const problem = getGeneralApiProblem(response)
                    if(problem) return problem
                }
                if(response.status===200) {

                    const attendance = response['data']
                    return {kind:"ok",result : attendance}
                }
                else {
                    console.log("bad data calendar")
                     return { kind:"bad-data"}
                }
        }
        catch{
            return { kind: "bad-data" }
        }
    }
    async getDataDayAttendance (tenantId:string,idDay:string):Promise<GetDataDayAttendance>{
        try {
            const response :ApiResponse<any>=
            await this.api.apisauce.get(`tenant/${tenantId}/attendances/${idDay}`)
            if(!response) {
                const problem = getGeneralApiProblem(response)
                if(problem) return problem
            }
            if(response.status===200){
                const dataDay = response['data']['result']
                return { kind:"ok" , result:dataDay}
            }
            else{
                return {kind:"ok" ,result:{}}
            }
        }
        catch {
                return {kind:"bad-data"}
        }
    }
    async getHistoryAttendance (tenantId:string,fromDate:number,toDate:number):Promise<GetDataAttendance>{
        try {
                const response :ApiResponse<any> = 
                await this.api.apisauce.get(`tenant/${tenantId}/attendances?from_date=${fromDate}&to_date=${toDate}`)
                if(!response){
                
                    const problem = getGeneralApiProblem(response)
                    if(problem) return problem
                }
                const attendance = response['data']
                return {kind:"ok",result : attendance}
        }
        catch{
            return { kind: "bad-data" }
        }
    }
}