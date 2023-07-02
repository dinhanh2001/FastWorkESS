import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import { ShiftChangeApi } from "../../services/api/shift-change"
import { load } from "../../utils/storage"
/**
 * Model description here for TypeScript hints.
 */
export const ShiftChangeStoreModel = types
  .model("ShiftChangeStore")
  .props({
    shiftchange: types.optional(types.frozen([]), []),
    recipients: types.optional(types.frozen([]), []),
    approvers: types.optional(types.frozen([]), []),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({
    createShiftShange: flow(function* (type: string) {
      self.setStatus("pending")
      const tenantId = yield load("tenantId")
      const response = new ShiftChangeApi(self.environment.api)
        const result = yield response.createShiftChange(tenantId,type,self.shiftchange,self.recipients,self.approvers)
        console.log(result)
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ShiftChangeStore extends Instance<typeof ShiftChangeStoreModel> {}
export interface ShiftChangeStoreSnapshotOut extends SnapshotOut<typeof ShiftChangeStoreModel> {}
export interface ShiftChangeStoreSnapshotIn extends SnapshotIn<typeof ShiftChangeStoreModel> {}
export const createShiftChangeStoreDefaultModel = () => types.optional(ShiftChangeStoreModel, {})
