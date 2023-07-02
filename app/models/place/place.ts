import { Instance, SnapshotOut, SnapshotIn, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const PlaceModel = types
  .model("Place")
  .props({
    id: types.maybe(types.string),
    time: types.maybe(types.string),
    address: types.maybe(types.string),
    type: types.maybe(types.string),
    lat: types.maybe(types.number),
    long: types.maybe(types.number),
    text: types.maybe(types.string),
    khu_vuc_cham_cong: types.maybe(types.boolean),
    r: types.maybe(types.number),
    tracking: types.maybe(types.boolean),
    tracking2: types.maybe(types.boolean),
    visitOut: types.maybeNull(types.string),
    visitAllow: types.maybe(types.boolean),
    visitAllowOut: types.maybeNull(types.boolean),
    visitPicture: types.maybe(types.boolean),
    visitPictureOut: types.maybe(types.boolean),
    checkPicture_Patrol: types.maybe(types.boolean),
    visitNetworkAllow: types.maybe(types.boolean),
    visitNetworkAllowOut: types.maybeNull(types.string),
    networkType: types.maybe(types.string),
    networkTypeOut: types.maybe(types.string),
    networkAllowIP: types.maybeNull(types.optional(types.frozen({}), [])),
    networkAllowIPOut: types.maybeNull(types.optional(types.frozen({}), [])),
    networkAllow: types.maybeNull(types.optional(types.frozen({}), [])),
    networkAllowOut: types.maybeNull(types.optional(types.frozen({}), [])),
    visitNetworkAllowIP: types.maybeNull(types.string),
    visitNetworkAllowOutIP: types.maybeNull(types.string),
    checkPicture_In: types.maybeNull(types.string),
    faceIDAllow: types.maybe(types.boolean),
    faceIDAllowOut: types.maybe(types.boolean),
    checkPicture_Out: types.maybe(types.boolean),
    shift: types.maybe(types.optional(types.frozen({}), [])),
    shift_ca: types.maybe(types.optional(types.frozen({}), [])),
    message: types.maybeNull(types.string),
    checkinHoliday: types.maybe(types.boolean),
    choiceShift: types.maybe(types.boolean),
    durationCheckout: types.maybe(types.number),
    choiceShiftLetter: types.maybe(types.boolean),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Place extends Instance<typeof PlaceModel> {}
export interface PlaceSnapshotOut extends SnapshotOut<typeof PlaceModel> {}
export interface PlaceSnapshotIn extends SnapshotIn<typeof PlaceModel> {}
export const createPlaceDefaultModel = () => types.optional(PlaceModel, {})
