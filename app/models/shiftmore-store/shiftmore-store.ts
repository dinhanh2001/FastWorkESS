import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ShiftmoreModel } from ".."
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import { ShiftmoreApi } from "../../services/api/shiftmore-api"
import { load } from "../../utils/storage"
/**
 * Model description here for TypeScript hints.
 */
export const ShiftmoreStoreModel = types
  .model("ShiftmoreStore")
  .props({
    date_start:types.optional(types.number,0),
    shift:types.optional(types.frozen({}), {}),
    recipients: types.optional(types.frozen([]), []),
    desc: types.optional(types.string,""),
    members: types.optional(types.frozen([]), []),
    approvers: types.optional(types.frozen([]), []),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setDataShiftmore: (date_start:number, shift:object, recipients, desc:string, members, approvers) => {
      self.date_start = date_start
      self.shift = shift
      self.recipients = recipients
      self.desc = desc
      self.members = members
      self.approvers = approvers
    },
  }))
  .actions((self) => ({
    createShiftmore: flow(function* () {
      self.setStatus("pending")
      const tenantId = yield load("tenantId")
      const response = new ShiftmoreApi(self.environment.api)
      const result = yield response.createShiftmore(tenantId,self.date_start,self.shift,self.recipients,self.desc,self.members,self.approvers)
      if(result['result']['result']){
        self.setStatus("done")
        return {
          result:result['result']['result'],
          active:true
        }
      }else {
        self.setStatus("done")
        return {
          result:result['result']['message'],
          active:false
        }
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ShiftmoreStore extends Instance<typeof ShiftmoreStoreModel> {}
export interface ShiftmoreStoreSnapshotOut extends SnapshotOut<typeof ShiftmoreStoreModel> {}
export interface ShiftmoreStoreSnapshotIn extends SnapshotIn<typeof ShiftmoreStoreModel> {}
export const createShiftmoreStoreDefaultModel = () => types.optional(ShiftmoreStoreModel, {})
