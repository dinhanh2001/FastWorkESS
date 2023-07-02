import messaging from "@react-native-firebase/messaging"
import * as storage from "../../utils/storage"
export async function requestUserPermission(): Promise<any> {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  if (enabled) {
    await messaging().registerDeviceForRemoteMessages()
    let token = await messaging().getToken()
     messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);
    storage.saveString("cloudId",token)
  }
}
async function onMessageReceived(message) {
  console.log(message)
}
