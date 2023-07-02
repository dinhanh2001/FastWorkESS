import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { OvertimeApi } from "../../services/api/overtime-api"
import { load } from "../../utils/storage"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"

/**
 * Model description here for TypeScript hints.
 */
export const OvertimeModel = types
  .model("Overtime")
  .props({
    overtime:types.optional(types.frozen([]) || undefined,[]),
    members:types.optional(types.frozen([]) || undefined,[]),
    recipients:types.optional(types.frozen([]) || undefined,[]),
    approvers:types.optional(types.frozen([]) || undefined,[]),
    desc: types.optional(types.string,""),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setDataOvertime : (overtime ,members,recipients,approvers,desc)=>{
      self.overtime = overtime
      self.members = members
      self.recipients = recipients 
      self.approvers = approvers
      self.desc = desc
    }
  }))
  .actions((self)=>({
    createOvertime : flow(function*(){
      self.setStatus("pending")
      const response = new OvertimeApi(self.environment.api)
      const tenantId = yield load("tenantId")
      const create = yield response.createOvertime(tenantId,self.overtime,self.recipients,self.desc,self.members,self.approvers)
      if(create['result']['result']){
        self.setStatus("done")
        return {
          result:create['result']['result'],
          active:true
        }
      }else {
        self.setStatus("done")
        return {
          result:create['result']['message'],
          active:false
        }
      }
    })

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Overtime extends Instance<typeof OvertimeModel> {}
export interface OvertimeSnapshotOut extends SnapshotOut<typeof OvertimeModel> {}
export interface OvertimeSnapshotIn extends SnapshotIn<typeof OvertimeModel> {}
export const createOvertimeDefaultModel = () => types.optional(OvertimeModel, {})
