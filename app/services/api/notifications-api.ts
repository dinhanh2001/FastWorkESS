import { ApiResponse } from "apisauce";
import { getSnapshot } from "mobx-state-tree";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import { NotificationResult ,UpdateNotifi ,CountNotification} from "./api.types";

export class NotificationsApi {
    
    private api:Api
    constructor (api:Api){
        this.api = api
    }
    async getNotification(tenantId:string,record:number):Promise<NotificationResult>{
        try{
            const response = await this.api.apisauce.get(`tenant/${tenantId}/notifications?skip=0&next=${record}`)
            //?skip=0&next=4
            if(!response){
                
                const problem = getGeneralApiProblem(response)
                if(problem) return problem
            }
            const notifiData = response['data']
            return {kind:"ok",result : notifiData}
        }
        catch(e) {
            return { kind: "bad-data" }
        }
    }
    async getNumberNotification (tenantId:string):Promise <CountNotification>{
        try {
            const response = await this.api.apisauce.get(`tenant/${tenantId}/notifications/count`)
            if(!response){
              const  problem = getGeneralApiProblem(response)
                if(problem) return problem
            }
            const numberNotifi = response['data'];
            return {kind:"ok" ,count:numberNotifi}
        }
        catch (e){
            return {kind:"bad-data"}
        }
    }
 
 }