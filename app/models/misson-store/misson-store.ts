import { Instance, SnapshotIn, SnapshotOut, types, flow, applySnapshot } from "mobx-state-tree"
import { CategoriesApi } from "../../services/api/categories-api"
import { MissonApi } from "../../services/api/misson-api"
import { load } from "../../utils/storage"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"

/**
 * Model description here for TypeScript hints.
 */
export const MissonStoreModel = types
  .model("MissonStore")
  .props({
    date_start: types.maybe(types.number),
    date_end: types.maybe(types.number),
    address: types.maybe(types.string),
    missons: types.optional(types.frozen([]), []),
    recipients: types.optional(types.frozen([]), []),
    members: types.optional(types.frozen([]), []),
    approvers: types.optional(types.frozen([]), []),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setPropsMisson: (date_start, date_end, address, missons, recipients, members, approvers) => {
      self.date_start= date_start
      self.date_end= date_end
      self.address= address
      self.missons= missons
      self.recipients= recipients
      self.members= members
      self.approvers= approvers
    },
  }))
  .actions((self) => ({
    renderListDay: flow(function* (st, end, hhmmStart, hhmmEnd, shiftcurrent) {
      self.setStatus("pending")
      const response = new CategoriesApi(self.environment.api)
      let tenantId = yield load("tenantId")
      const result = yield response.getShiftV2(tenantId, st, end)
      const arrShiftv2 = result["result"][0]["data"]
      let arr = []
      const numberDay = 24 * 60 * 60 * 1000
      for (let i = st; i <= end; i += numberDay) {
        arr.push({
          date_start: i,
          time_start: hhmmStart,
          time_end: hhmmEnd,
          shift:
            typeof arrShiftv2[`${new Date(i).getDate()}`]["shift"][0] == "undefined"
              ? shiftcurrent
              : arrShiftv2[`${new Date(i).getDate()}`]["shift"][
                  `${arrShiftv2[`${new Date(i).getDate()}`]["shift"].length - 1}`
                ],
        })
      }
      return arr
    }),
    createMisson: flow(function* () {
      self.setStatus("pending")
      const tenantId = yield load("tenantId")
      const response = new MissonApi(self.environment.api)
      const create = yield response.createMisson(
        tenantId,
        self.date_start,
        self.date_end,
        self.address,
        self.missons,
        self.recipients,
        self.approvers,
        self.members,
      )
      if(create['result']['result']){
        self.setStatus("done")
        return {
          result:create['result']['result'],
          active:true
        }
      }else {
        self.setStatus("error")
        return {
          result:create['result']['message'],
          active:false
        }
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface MissonStore extends Instance<typeof MissonStoreModel> {}
export interface MissonStoreSnapshotOut extends SnapshotOut<typeof MissonStoreModel> {}
export interface MissonStoreSnapshotIn extends SnapshotIn<typeof MissonStoreModel> {}
export const createMissonStoreDefaultModel = () => types.optional(MissonStoreModel, {})
