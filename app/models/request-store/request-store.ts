import { Instance, SnapshotIn, SnapshotOut, types, flow, applySnapshot } from "mobx-state-tree"
import { RequestApi } from "../../services/api/request-api"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import { RequestModel } from "../request/request"
import * as storage from "../../utils/storage"
import { GetSummary } from "../../services/api"
/**
 * Model description here for TypeScript hints.
 */
export const RequestStoreModel = types
  .model("RequestStore")
  .props({
    listRequest: types.optional(types.array(RequestModel), []),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getSummary: flow(function* (
      fromDate: number,
      toDate: number,
      next: number,
      type?: string,
      status?: string,
    ) {
      self.setStatus("pending")
      const requestApi = new RequestApi(self.environment.api)
      const tenantId = yield storage.load("tenantId")
      const requestResult: GetSummary = yield requestApi.getSummary(
        tenantId,
        fromDate,
        toDate,
        next,
        type,
        status,
      )
      if (requestResult.kind === "ok") {
        self.setStatus("done")
        let dataResult = requestResult["result"]
        if (dataResult) {
          applySnapshot(self.listRequest, dataResult)
        } else {
          applySnapshot(self.listRequest, [])
        }
      } else {
        self.setStatus("error")
        console.log("return request failt")
      }
    }),
    
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface RequestStore extends Instance<typeof RequestStoreModel> {}
export interface RequestStoreSnapshotOut extends SnapshotOut<typeof RequestStoreModel> {}
export interface RequestStoreSnapshotIn extends SnapshotIn<typeof RequestStoreModel> {}
export const createRequestStoreDefaultModel = () => types.optional(RequestStoreModel, {})
