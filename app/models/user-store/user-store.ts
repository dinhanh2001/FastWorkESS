import { flow, Instance, SnapshotOut, types, applySnapshot} from "mobx-state-tree"
import { GetCurrentUser, UpdateProfile } from "../../services/api";
import { UserApi } from "../../services/api/user-api"
import { withEnvironment } from "../extensions/with-environment";
import { withStatus } from "../extensions/with-Status";

import * as storage  from "../../utils/storage"
import { Platform } from "react-native"
/**
 * Model description here for TypeScript hints.
 */

export const UserStoreModel = types
  .model("UserStore",{
    id: types.maybe(types.string),
    email: types.maybe(types.string),
    // organizations: types.maybe(types.string),
    birthday: types.maybeNull(types.number),
    email2: types.maybe(types.string),
    gender: types.maybe(types.string),
    address: types.maybeNull(types.string),
    date_start_wrok: types.maybe(types.string),
    avatar: types.maybe(types.string),
    name: types.maybe(types.string),
    phone: types.maybe(types.string),
    position: types.maybe(types.string),
    token: types.maybe(types.string),
    settings: types.maybe(types.frozen({})),
  })
  .views((self) => ({}))
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => ({
    setEmail: flow(function* (value: string) {
      self.email = value
    }),
    getCurrentUser: flow(function* getCurrentUser() {
      const tenantId = yield storage.load('tenantId')
      const userApi = new UserApi(self.environment.api)
      const response: GetCurrentUser = yield userApi.getCurrentUser(tenantId)
      if(response['kind'] == 'ok' && response["result"]['data']){
        const data: object = response["result"]['data']['result']
        applySnapshot(self, data)
      }else{
        console.log("Get Current User failed:",response)
        applySnapshot(self, {})
      }
    }),
  }))
  .actions((self) => ({
    updateProfile: flow(function* updateProfile(data: object) {
      self.setStatus("pending")
      const tenantId = yield storage.load('tenantId')
      const userApi = new UserApi(self.environment.api);
      const result: UpdateProfile = yield userApi.updateProfile(tenantId, data)
      if(result['kind'] == 'ok' && result['result']['data']['result'] == true){
        console.log("ok")
        self.getCurrentUser()
        self.setStatus("done")
        return result;
      }else{
        self.setStatus("error")
        return result;
      }
    }),
    updateAvatar: flow(function* updateAvatar(data: object) {
      self.setStatus("pending")
      const tenantId = yield storage.load('tenantId')
      const userApi = new UserApi(self.environment.api);
      const result: UpdateProfile = yield userApi.updateAvatar(tenantId, data)
      self.setStatus("done")
      return result;
    }),
  }))
  .actions((self) => ({
    afterCreate() {
      self.getCurrentUser()
    },
    resgisterFireBase: flow(function*(email:string,tenantId:string,cloudId:string ){
      self.setStatus("pending")
      let type = Platform.OS==="ios" ? "ios" :"Android"
      const firebaseApi = new UserApi(self.environment.api);
     
      const postCloudId = yield firebaseApi.registerFireBase(email,tenantId,cloudId ,type,"ESS")
      if(postCloudId['result']['status']===200){
        console.log("ok",postCloudId['result']['status'])
          self.setStatus("done")
      }
      else {
        self.setStatus("error")
        console.log("post cloudId failt")
      }

    })
    
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType { }
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType { }
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
