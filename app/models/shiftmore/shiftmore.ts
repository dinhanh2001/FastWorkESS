import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ShiftmoreModel = types
  .model("Shiftmore")
  .props({
    date_start: types.optional(types.number, 0),
    shift: types.optional(types.frozen({}) || undefined,{})
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Shiftmore extends Instance<typeof ShiftmoreModel> {}
export interface ShiftmoreSnapshotOut extends SnapshotOut<typeof ShiftmoreModel> {}
export interface ShiftmoreSnapshotIn extends SnapshotIn<typeof ShiftmoreModel> {}
export const createShiftmoreDefaultModel = () => types.optional(ShiftmoreModel, {})
