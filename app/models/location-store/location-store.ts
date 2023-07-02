import { Instance, SnapshotOut, types, SnapshotIn, applySnapshot, flow } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const LocationStoreModel = types
  .model("LocationStore")
  .props({
    coords: types.maybeNull(types.maybe(types.frozen({}))),
    mocked: types.maybeNull(types.maybe(types.boolean)),
    provider: types.maybeNull(types.maybe(types.string)),
    timestamp: types.maybeNull(types.maybe(types.number))
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    saveLocation:  function (location: object){
      applySnapshot(self, location);
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LocationStore extends Instance<typeof LocationStoreModel> {}
export interface LocationStoreSnapshotOut extends SnapshotOut<typeof LocationStoreModel> {}
export interface LocationStoreSnapshotIn extends SnapshotIn<typeof LocationStoreModel> {}
export const createLocationStoreDefaultModel = () => types.optional(LocationStoreModel, {})
