import { Instance, SnapshotOut, types,SnapshotIn, flow } from "mobx-state-tree"
import { CategoriesApi } from "../../services/api/categories-api"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import { load } from "../../utils/storage"
/**
 * Model description here for TypeScript hints.
 */
export const CategoriesStoreModel = types
  .model("CategoriesStore")
  .props({})
  .extend(withStatus)
  .extend(withEnvironment)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    
    flatArray : (arrayFlat:any) =>{
      let arr =[]
      const result = arrayFlat.map((value,index)=>{
        return value['approvers']
      }) 
      arr= result.flat(Infinity)
      return arr
    },
    getShift : flow(function* (){
      self.setStatus("pending")
      const response = new CategoriesApi(self.environment.api)
      let tenantId = yield load("tenantId")
      let result = yield response.getShift(tenantId)
      if(result['kind'] === "ok" ){
        self.setStatus("done")
        return result['result']
      }
      else{
        self.setStatus("error")
        return []
      }
    }),
    categoriesleave : flow(function* (type:string){
      self.setStatus("pending")
      const response = new CategoriesApi(self.environment.api)
      let tenantId = yield load("tenantId")
      let result = yield response.categoriesleave(tenantId,type)
      if(result['kind'] === "ok" ){
        self.setStatus("done")
        return result['result']
      }
      else{
        self.setStatus("error")
        return []
      }
    }),
    ShiftV2 : flow (function*(fromDate:number,toDate:number,email:string){
      self.setStatus("pending")
      const response = new CategoriesApi(self.environment.api)
      let tenantId = yield load("tenantId")
      let result = yield response.getShiftV2(tenantId,fromDate,toDate,email)
      if(result['kind'] === "ok" ){
        self.setStatus("done")
        return result['result']
      }
      else{
        self.setStatus("error")
        return []
      }
    }),
    Approver : flow (function *(type:string){
      self.setStatus("pending")
      const response = new CategoriesApi(self.environment.api)
      let tenantId = yield load("tenantId")
      let result = yield response.approver(tenantId,type)
      if(result['result']){
        self.setStatus("done")
        return result['result']
      }
      else {
        self.setStatus("error")
        return []
      }
     
    }),
    Recipients:flow (function*(){
      self.setStatus("pending")
      const response = new CategoriesApi(self.environment.api)
      const tenantId = yield load("tenantId")
      const result = yield response.recipients(tenantId)
      if(result['result']){
        self.setStatus("done")
        return result['result']['result']
      }
      else {
        self.setStatus("error")
        return []
      }
    }),
    shiftDetail :flow (function * (type:string ,id:string){
      self.setStatus("pending")
      const response = new CategoriesApi(self.environment.api)
      const tenantId = yield load("tenantId") 
      const result = yield response.shiftDetail(tenantId,type,id)
      if(result['result']){
        self.setStatus("done")
        return result['result']
      }
      else {
        self.setStatus("error")
        return {}
      }
    }),
    GroupOrg : flow (function*(){
      self.setStatus('pending')
      const response = new CategoriesApi(self.environment.api)
      const tenantId = yield load("tenantId") 
      const result = yield response.getOrgGroup(tenantId)
      console.log(result)
    })

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CategoriesStore extends Instance<typeof CategoriesStoreModel> {}
export interface CategoriesStoreSnapshotOut extends SnapshotOut<typeof CategoriesStoreModel> {}
export interface CategoriesStoreSnapshotIn extends SnapshotIn<typeof CategoriesStoreModel> {}
export const createCategoriesStoreDefaultModel = () => types.optional(CategoriesStoreModel, {})
