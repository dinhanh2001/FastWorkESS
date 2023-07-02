import { ApiResponse } from "apisauce";
import { Api } from "./api";
import { getGeneralApiProblem } from "./api-problem";
import { LoginResult ,PlaceResult, ChangePassword } from "./api.types";
export class AuthenticationApi {
    
    private api:Api
    constructor (api:Api){
        this.api = api
    }
    async login(email: string, password: string,deviceId:string | null,phoneNumber:string | null,device:string | null): Promise<LoginResult> {
        try{
            
            const response :ApiResponse<any> = await this.api.apisauce.post("auth/login",{email,password,deviceId,phoneNumber,device})
            if(response['status'] !== null){
                if(!response.data['message']){
                
                return {kind:"ok",authentication:response.data }
                     }
                else {
                    return {kind:"ok",authentication: response.data['message']}
                }
            }
            else {
                return {
                    kind:"bad-data"
                }
            }
           
        }
        catch(e){

            return {kind:'bad-data'}
        }

    }
    async getPlace(tenantId:string):Promise<PlaceResult> {
        try{
            
            const response :ApiResponse<any> = await this.api.apisauce.get(`tenant/${tenantId}/places`)
            if(!response.ok){
                const problem = getGeneralApiProblem(response)
                if(problem) return problem
            }
            
            return {kind:"ok" ,organizations:response}
        }
        catch(e){
                
                return {kind:"bad-data"}
                
        }
    }
    async changePassword(currentpassword: string,newpassword:string):Promise<ChangePassword> {
      try{
        const response :ApiResponse<any> = await this.api.apisauce.put(`auth/change-password`,{currentpassword, newpassword})
        if(!response.ok){
            const problem = getGeneralApiProblem(response)
                if(problem) return problem
        }
        return { kind:"ok",result:response}
      }
      catch{
        return {kind:"bad-data"}
      }
  }
 }
 /**
  * {"avatar": "https://drive.fastwork.vn:6007/avatar/5e0432758c26e0980f957ff6/1658736447840.jpg",
  *  "code": "kd1", "email": "hinh1@kd1", "email2": "hungmb@gmail.com", "formwork": "",
  *  "gender": "Nam", "id": "5e37d1fa8cd674b4210933f4", "name": "Nguyễn Hoàng Quân",
  *  "namekd": "nguyen_hoang_quan", "org": [{"_id": "5e0432758c26e0980f957ff6", 
  * "name": "Hinh", "settings": [Object]}, {"_id": "5e5dbcc79dfa8ad42af7a62a", 
  * "name": "DEMO XÂY DỰNG", "settings": [Object]}], 
  * "organizations": {"5e0432758c26e0980f957ff6": {"active": true, "leader": true, "role": "manager"},
  *  "5e5dbcc79dfa8ad42af7a62a": {"active": true, "role": "manager"}}, "phone": "0355446932",
  *  "settings": {"anyLocationR": false, "anyLocationV": false, "autoTracking": -1, 
  * "manualTracking": -1, "passcheckin": "Không", "position": "Trưởng nhóm",
  *  "sendSos": -1, "sendSos_Min": 30, "timesTracking": -1, "track": true,
  *  "tracking": -1, "tracking2": -1, "updateAvatarVerify": true, "visitAllow": -1,
  *  "visitAllowOut": -1, "visitDistance": 50, "visitDistanceOut": 50, 
  * "visitPicture": -1, "visitPictureDD": -1, "visitPictureOut": -1}, "ten_nhan_vien": "Nguyễn Hoàng Quân",
  *  "token": "Basic aGluaDFAa2QxOjViOTMwZDg4MDhhZTYzMmM4MzNhMDVlYjdlNzU0OGM2"}
  */