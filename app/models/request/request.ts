import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const RequestModel = types
  .model("Request")
  .props({
    _id:types.maybe(types.string),
    status:types.maybe(types.string),
    createdDate:types.maybe(types.number),
    type:types.maybe(types.string),
    createdBy:types.maybe(types.frozen({})),
    absence:types.optional(types.frozen([]) || undefined,[]),
    approvers :types.optional(types.frozen([])|| undefined,[]),
    recipients:types.optional(types.frozen([])|| undefined,[])
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Request extends Instance<typeof RequestModel> {}
export interface RequestSnapshotOut extends SnapshotOut<typeof RequestModel> {}
export interface RequestSnapshotIn extends SnapshotIn<typeof RequestModel> {}
export const createRequestDefaultModel = () => types.optional(RequestModel, {})
