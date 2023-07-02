import { flow, Instance, SnapshotIn, SnapshotOut, types, applySnapshot } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import * as storage from "../../utils/storage"
import { checkinResult, faceVerifyResult, getLastActivitiesResult, TimesheetsApi } from "../../services/api"
/**
 * Model description here for TypeScript hints.
 */
export const TimesheetStoreModel = types
  .model("TimesheetStore", {
    message: types.maybe(types.string),
    viengtham: types.maybe(types.boolean),
    congviec: types.maybe(types.frozen({})),
    allowCheckout: types.maybe(types.boolean),
    result: types.maybe(types.frozen({})),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => ({
    getLastActivities: flow(function* () {
      self.setStatus('pending')
      const tenantId = yield storage.load('tenantId')
      const timesheetApi = new TimesheetsApi(self.environment.api)
      const lastActivitiesResult: getLastActivitiesResult = yield timesheetApi.getLastActivities(tenantId)
      if (lastActivitiesResult['kind'] == 'ok' && lastActivitiesResult) {
        applySnapshot(self, lastActivitiesResult['result'])
        self.setStatus("done")
      }
      else {
        self.setStatus("error")
        console.log("lastActivitiesResult", lastActivitiesResult);
      }
    })
  }))
  .actions((self) => ({
    checkin: flow(function* (data) {
      self.setStatus('pending')
      const tenantId = yield storage.load("tenantId");
      const timesheetApi = new TimesheetsApi(self.environment.api)
      const checkinResult: checkinResult = yield timesheetApi.checkIn(tenantId, data)
      if (checkinResult['kind'] == 'ok' && checkinResult) {
        self.getLastActivities()
        self.setStatus("done")
        return checkinResult.result;
      }
      else {
        self.setStatus("error")
        console.log("checkinResult", checkinResult);
        return checkinResult;
      }
    }),
    faceVerify: flow(function* (data) {
      self.setStatus("pending")
      const tenantId = yield storage.load("tenantId");
      const timesheetApi = new TimesheetsApi(self.environment.api)
      const faceVerifyResult: faceVerifyResult = yield timesheetApi.faceVerify(tenantId, { image: data, mobilev2: true })
      if (faceVerifyResult['kind'] == 'ok' && faceVerifyResult) {
        self.setStatus("done")
        return faceVerifyResult.result;
      }
      else {
        self.setStatus("error")
        console.log("faceVerifyResult", faceVerifyResult);
        return faceVerifyResult;
      }
    })
  }))
  .actions((self) => ({
    afterCreate() {
      self.getLastActivities()
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface TimesheetStore extends Instance<typeof TimesheetStoreModel> { }
export interface TimesheetStoreSnapshotOut extends SnapshotOut<typeof TimesheetStoreModel> { }
export interface TimesheetStoreSnapshotIn extends SnapshotIn<typeof TimesheetStoreModel> { }
export const createTimesheetStoreDefaultModel = () => types.optional(TimesheetStoreModel, {})

