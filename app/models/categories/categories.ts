import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const CategoriesModel = types
  .model("Categories")
  .props({
    type:types.maybe(types.string),
    status:types.maybe(types.string),
    createdDate:types.optional(types.number, 0),
    recipients:types.optional(types.frozen([]) || undefined,[]),
    approvers:types.optional(types.frozen([]) || undefined,[]),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Categories extends Instance<typeof CategoriesModel> {}
export interface CategoriesSnapshotOut extends SnapshotOut<typeof CategoriesModel> {}
export interface CategoriesSnapshotIn extends SnapshotIn<typeof CategoriesModel> {}
export const createCategoriesDefaultModel = () => types.optional(CategoriesModel, {})
