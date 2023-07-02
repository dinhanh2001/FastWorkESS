import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const NotificationModel = types
  .model("Notification")
  .props({
    _id:types.maybeNull(types.string),
    sender:types.maybe(types.frozen({})),
    datetime:types.maybe(types.number),
    summary:types.maybe(types.string),
    url:types.maybe(types.string),
    content:types.maybe(types.frozen({})),
   
  })

export interface Notification extends Instance<typeof NotificationModel> {}
export interface NotificationSnapshotOut extends SnapshotOut<typeof NotificationModel> {}
export interface NotificationSnapshotIn extends SnapshotIn<typeof NotificationModel> {}
export const createNotificationDefaultModel = () => types.optional(NotificationModel, {})
