
import {Api} from "../../services/api"
import * as storage from "../../utils/storage"
let ReactotronDev
if (__DEV__) {
  const { Reactotron } = require("../../services/reactotron")
  ReactotronDev = Reactotron
}
export class Environment {
  
  constructor() {
    // create each service
     
    this.api = new Api()
  }

  async setup() {
    await this.api.setup()
  }
  async authenticate(token:string){
    await this.api.setAuthToken(token)
  }


  async setTenantId (tenantId:string){
      await storage.save("tenantId",tenantId)
  }
    async getTenantId (){
        return  await storage.load('tenantId')
  }
  async removetenantId() {
      return await storage.remove('tenantId')
  }
  async getCloudId () {
    return await storage.load("cloudId")
  }
  async removeCloudId () {
    return await storage.remove("cloudId")
  }
  /**
   * Reactotron is only available in dev.
   */
  //reactotron: typeof ReactotronDev

  /**
   * Our api.
   */
  api: Api
}
