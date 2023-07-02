//10.0.1.126:3000/v1/auth/login/
//const API_URL = "http://10.0.1.131:3000/v1/";
// http://beta.fastwork.vn:2006/Users/MobileLogin
 const { API_URL } = require("../../config/env")
export interface ApiConfig {
  url: string 
  timeout: number,
}
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: API_URL ,
  timeout: 20000,
}