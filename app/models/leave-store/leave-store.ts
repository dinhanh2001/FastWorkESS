import { Instance, SnapshotOut, types, SnapshotIn, flow } from "mobx-state-tree"
import { LeaveApi } from "../../services/api/leave-api"
import { load } from "../../utils/storage"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"

/**
 * Model description here for TypeScript hints.
 */
export const LeaveStoreModel = types
  .model("LeaveStore")
  .props({
    reason: types.optional(types.frozen({}), {}),
    date_start: types.optional(types.number, 0),
    time_start: types.optional(types.number, 0),
    time_end: types.optional(types.number, 0),
    recipients: types.optional(types.frozen([]), []),
    approvers: types.optional(types.frozen([]), []),
    shift_current: types.optional(types.frozen({}), {}),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({}))
  .actions((self)=>({
    setPropsLeave: (reason ,date_start,time_start,time_end,recipients,approvers,shift_current)=>{
        self.reason=reason
        self.date_start=date_start
        self.time_start=time_start
        self.time_end=time_end
        self.recipients=recipients
        self.approvers=approvers
        self.shift_current=shift_current
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    createLeave: flow(function* () {
      self.setStatus("pending")
      const response = new LeaveApi(self.environment.api)
      let tenantId = yield load("tenantId")
      const create = yield response.createLeave(
        tenantId,
        self.reason,
        self.date_start,
        self.time_start,
        self.time_end,
        self.recipients,
        self.approvers,
        self.shift_current,
      )
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
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LeaveStore extends Instance<typeof LeaveStoreModel> {}
export interface LeaveStoreSnapshotOut extends SnapshotOut<typeof LeaveStoreModel> {}
export interface LeaveStoreSnapshotIn extends SnapshotIn<typeof LeaveStoreModel> {}
export const createLeaveStoreDefaultModel = () => types.optional(LeaveStoreModel, {})
