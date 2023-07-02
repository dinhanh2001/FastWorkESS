import { applySnapshot, getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import { AuthenticationApi, PlaceResult } from "../../services/api"
import { LoginResult, LogOutResult, ChangePassword } from "../../services/api"
import { flow } from "mobx"
// import { RootStoreModel } from "../root-store/root-store"

/**
 * Model description here for TypeScript hints. // terantId
 */
export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    isAuthenticationStore: types.maybe(types.boolean),
    token: types.maybe(types.string),
    savePassword:types.maybe(types.boolean),
    name:types.maybe(types.string),
    image:types.maybe(types.string),
    email:types.maybe(types.string),
    
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({
  }))
  .actions((self) => ({
    setAuthentication: flow(function* (value: boolean) {
      self.isAuthenticationStore = value
    }),
    setToken: flow(function* (token: any) {
      self.token = token
    }),
    setSavePassword : flow(function*( value :boolean){
      self.savePassword = value
    }),
    setNameUser: flow (function*(value:string){
      self.name=value
    }),
    setImage: flow (function*(value:string){
      self.image=value
    }),
    setEmail: flow (function*(value:string){
      self.email=value
    })
  }))
  .actions((self) => ({
    login: flow(function* (emailAddress: string, password: string,deviceId:string | null,phoneNumber:string | null,device:string | null) {
      self.setStatus("pending")
      const authenticationApi = new AuthenticationApi(self.environment.api)
      const result: LoginResult = yield authenticationApi.login(emailAddress, password,deviceId,phoneNumber,device)
      console.log("result login: ", result)
       if(result['authentication']['token']){
        const organization = result['authentication']['org']
        let name = result['authentication']['name']
        let image = result['authentication']['avatar']
        let email = result['authentication']['email']
        let token = result["authentication"]["token"];
          self.setNameUser(name)
          self.setImage(image)
          self.setEmail(email)
         // self.setAuthentication(true)
          self.setToken(token)
          self.environment.authenticate(token)
          // RootStoreModel.actions./
         // self.environment.settenantId(organization)
          self.setStatus("done")
          return organization
       }
       else {
        self.setToken("")
        self.setStatus("error")
        self.environment.authenticate("")
        return result['authentication']
       }
     
    }),
    logout: flow(function* () {
      self.setNameUser("")
      self.setImage("")
      self.setEmail("")
      self.setToken("")
      self.environment.authenticate("")
      self.environment.removetenantId()
      self.setAuthentication(false)
      self.environment.removeCloudId()
    }),
    changePassword: flow(function* (currentpassword: string, newpassword: string) {
      self.setStatus("pending")
      const authenticationApi = new AuthenticationApi(self.environment.api)
      const result: ChangePassword = yield authenticationApi.changePassword(currentpassword, newpassword)
      // console.log("log: ",result)
      if(result['kind'] == "ok" && result['result']['data']['result'] == true){
        const token = result['result']['data']['newservice']
        self.setToken(token) 
        self.environment.authenticate(token)
        return result['result']['data']
      }else if(result['kind'] == "ok" && result['result']['data']['result'] == false){
        // console.log("sai tai khoan: ",result['result']['data'])
        return result['result']['data']
      }
    })
  }))

type AuthenticationStoreType = Instance<typeof AuthenticationStoreModel>
export interface AuthenticationStore extends AuthenticationStoreType {}
type AuthenticationStoreSnapshotType = SnapshotOut<typeof AuthenticationStoreModel>
export interface AuthenticationStoreSnapshot extends AuthenticationStoreSnapshotType {}
export const createAuthenticationStoreDefaultModel = () =>
  types.optional(AuthenticationStoreModel, {})
