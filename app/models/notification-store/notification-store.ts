import { applySnapshot, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { CountNotification, NotificationResult, NotificationsApi } from "../../services/api"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import * as storage from "../../utils/storage"
import {NotificationModel} from "../notification/notification"
/**
 * Model description here for TypeScript hints.
 */

export const NotificationStoreModel = types
  .model("NotificationStore")
  .props({
     notificationList :types.optional(types.array(NotificationModel),[])
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({
    // gettenantId: flow(function*(){
    //   let tenantId =yield self.environment.getTenantId()
    //   return tenantId
    // })
  }))
  .actions((self) => ({
   
    // saveNotifi: (dataNotifi:NotificationSnapshotOut[]) => {
    //   self.notificationList.replace(dataNotifi)
    // },
  }))
  .actions((self) => ({
    
    getNotification :flow (function* ( record:number)  {
      self.setStatus("pending")
      const notificationApi = new NotificationsApi(self.environment.api)
     const tenantId =yield storage.load("tenantId")
     const notifiResult: NotificationResult  = yield notificationApi.getNotification(tenantId,record)
      if(notifiResult && notifiResult['result'] ){
        applySnapshot(self.notificationList,notifiResult['result'])
        self.setStatus("done")
       
      }
      else{
        self.setStatus("error")
        console.log("return notification failt");
      }
    }),
    getNumberNotification :flow (function *()  {
      self.setStatus("pending");
      const notificationApi = new NotificationsApi(self.environment.api)
      const tenantId =yield storage.load("tenantId")
     
      const countNotifi:CountNotification = yield notificationApi.getNumberNotification(tenantId)
      if(countNotifi.kind==="ok"){
        self.setStatus("done")
        //applySnapshot(self.numberNewNotifi,countNotifi["count"]["result"])
        return countNotifi["count"]["result"]
      }
      else {
        self.setStatus("error");
        console.log("return numberNotification failt");
      }
    
  
    })
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type NotificationStoreType = Instance<typeof NotificationStoreModel>
export interface NotificationStore extends NotificationStoreType {}
type NotificationStoreSnapshotType = SnapshotOut<typeof NotificationStoreModel>
export interface NotificationStoreSnapshot extends NotificationStoreSnapshotType {}
export const createNotificationStoreDefaultModel = () => types.optional(NotificationStoreModel, {})
