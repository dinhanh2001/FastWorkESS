import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import {  NotificationParamsList} from "../../navigators"
import { Screen ,Header ,NotificationList } from "../../components"


const ROOT: ViewStyle = {
  flex:1,
}
export const NotificationsScreen: FC<StackScreenProps<NotificationParamsList, "notificationList">> = observer(function NotificationsScreen({navigation,route}) {
  
  return (
    <Screen style={ROOT} preset="fixed" statusBar="dark-content">
      <Header border={true} headerTx="notificationScreen.headerText"  />
      <NotificationList navigation={navigation} />
    </Screen>
  )
})
