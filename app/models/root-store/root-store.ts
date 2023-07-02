import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"
import { AuthenticationStoreModel } from "../authentication-store/authentication-store"
import { UserStoreModel } from "../user-store/user-store"
import { NotificationStoreModel } from "../notification-store/notification-store"
import { AttendanceModel } from "../attendance/attendance"
import { RequestStoreModel } from "../request-store/request-store"
import { CategoriesStoreModel } from "../categories-store/categories-store"
import { PlaceModel } from "../place/place"
import { PlaceStoreModel } from "../place-store/place-store"
import { TimesheetStoreModel } from "../timesheet-store/timesheet-store"
import { AbsenceStoreModel } from "../absence-store/absence-store"
import {  LeaveStoreModel } from "../leave-store/leave-store"
import { ShiftmoreStoreModel } from "../shiftmore-store/shiftmore-store"
import { OvertimeModel } from "../overtime/overtime"
import { MissonStoreModel } from "../misson-store/misson-store"
import { WorktimeStoreModel } from "../worktime-store/worktime-store"
import { LocationStoreModel } from "../location-store/location-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  authenticationStore:types.optional(AuthenticationStoreModel,{} as any),
  userStore:types.optional(UserStoreModel,{} as any),
  notificationStore:types.optional(NotificationStoreModel,{} as any),
  attendanceStore:types.optional(AttendanceModel,{} as any),
  requestStore :types.optional(RequestStoreModel,{} as any),
  categoriesStore:types.optional(CategoriesStoreModel,{} as any),
  absenceStore:types.optional(AbsenceStoreModel,{} as any),
  Place :types.optional(PlaceModel,{} as any),
  PlaceStore :types.optional(PlaceStoreModel,{} as any),
  TimesheetStore :types.optional(TimesheetStoreModel,{} as any),
  leaveStore :types.optional(LeaveStoreModel,{} as any),
  shiftMoreStore:types.optional(ShiftmoreStoreModel,{} as any),
  overtimeStore : types.optional(OvertimeModel,{} as any),
  missonStore : types.optional(MissonStoreModel,{} as  any),
  worktimeStore :types.optional(WorktimeStoreModel,{} as any),
  locationStore :types.optional(LocationStoreModel,{} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
