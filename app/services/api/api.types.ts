import { GeneralApiProblem } from "./api-problem"
import { Character } from "../../models/character/character"
export interface User {
  id: number
  name: string
}

// Authentication
export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetCharactersResult = { kind: "ok"; characters: Character[] } | GeneralApiProblem
export type GetCharacterResult = { kind: "ok"; character: Character } | GeneralApiProblem
export type LoginResult = { kind: "ok"; authentication: object } | GeneralApiProblem
export type LogOutResult = { kind: "ok" } | GeneralApiProblem
export type RegiserResult = { kind: "ok" } | GeneralApiProblem
export type ChangePassword = { kind: "ok"; result: object } | GeneralApiProblem

// Place
export type PlaceResult = { kind: "ok"; organizations: object } | GeneralApiProblem

// User
export type UpdateProfile = { kind: "ok"; result: object } | GeneralApiProblem
export type GetCurrentUser = { kind: "ok"; result: object } | GeneralApiProblem
export type UpdateAvatar = { kind: "ok"; result: object } | GeneralApiProblem

// Notification
export type NotificationResult = { kind: "ok"; result: any } | GeneralApiProblem
export type UpdateNotifi = { kind: "notifi"; result: object } | GeneralApiProblem
export type CountNotification = { kind: "ok"; count: any } | GeneralApiProblem
export type GetDataAttendance = { kind: "ok"; result: [] } | GeneralApiProblem
export type GetDataDayAttendance = { kind: "ok"; result: object } | GeneralApiProblem
export type GetSummary = { kind: "ok"; result: any } | GeneralApiProblem
export type CategoriesResult = { kind: "ok"; result: [] } | GeneralApiProblem
export type CreateAbsenceResult = { kind: "ok"; result: object } | GeneralApiProblem
export type ShiftDetail = { kind: "ok"; result: object } | GeneralApiProblem
export type Shiftmore = { kind: "ok"; result: object } | GeneralApiProblem
export type ShiftChange = { kind: "ok"; result: object } | GeneralApiProblem
export type LoaiCa = { kind: "ok"; result: [] } | GeneralApiProblem
export type GroupOrg = { kind: "ok"; result: object } | GeneralApiProblem
// Places Checkin
export type GetPlacesResult = { kind: "ok"; result: Array<object> } | GeneralApiProblem

// Timesheet
export type getLastActivitiesResult = { kind: "ok"; result: object } | GeneralApiProblem
export type checkinResult = { kind: "ok"; result: object } | GeneralApiProblem
export type faceVerifyResult = { kind: "ok"; result: object } | GeneralApiProblem
