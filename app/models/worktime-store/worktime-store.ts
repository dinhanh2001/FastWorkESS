import { applySnapshot, flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { WorkTimeApi } from "../../services/api/worktime-api"
import { load } from "../../utils/storage"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"

/**
 * Model description here for TypeScript hints.
 */
export const WorktimeStoreModel = types
  .model("WorktimeStore")
  .props({
    date_start: types.optional(types.number, 0),
    date_end: types.optional(types.number, 0),
    late: types.optional(types.number, 0),
    early: types.optional(types.number, 0),
    recipients: types.optional(types.frozen([]), []),
    desc: types.optional(types.string, ""),
    approvers: types.optional(types.frozen([]), []),
    reason: types.optional(types.frozen({}), {}),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setDataWorktime: (
      date_start,
      date_end: number,
      late: number,
      early: number,
      recipients,
      desc: string,
      approvers,
      reason: object,
    ) => {
      self.date_start = date_start
      self.date_end = date_end
      ;(self.late = late), (self.early = early)
      self.recipients = recipients
      self.desc = desc
      self.approvers = approvers
      self.reason = reason
    },
  }))
  .actions((self) => ({
    createWorktime: flow(function* () {
      self.setStatus("pending")
      const response = new WorkTimeApi(self.environment.api)
      let tenantId = yield load("tenantId")
      const create = yield response.createWorkTime(
        tenantId,
        self.date_start,
        self.date_end,
        self.late,
        self.early,
        self.recipients,
        self.desc,
        self.approvers,
        self.reason,
      )
      console.log("create",create)
      if (create["result"]["result"]) {
        self.setStatus("done")
        return {
          result: create["result"]["result"],
          active: true,
        }
      } else {
        self.setStatus("done")
        return {
          result: create["result"]["message"],
          active: false,
        }
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WorktimeStore extends Instance<typeof WorktimeStoreModel> {}
export interface WorktimeStoreSnapshotOut extends SnapshotOut<typeof WorktimeStoreModel> {}
export interface WorktimeStoreSnapshotIn extends SnapshotIn<typeof WorktimeStoreModel> {}
export const createWorktimeStoreDefaultModel = () => types.optional(WorktimeStoreModel, {})
