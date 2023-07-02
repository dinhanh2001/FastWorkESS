import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StatusBar, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { Screen ,Notificationdetail, Header} from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import {NotificationParamsList} from "../../navigators/app-navigator"
const ROOT: ViewStyle = {
  flex: 1,
}
export const DetailNotificationScreen: FC<StackScreenProps<NotificationParamsList, "DetailNotificationScreen">> = observer(
  function DetailNotificationScreen({route ,navigation}) {
    const item = route.params;
      return (
        <Screen style={ROOT} preset="fixed">
          <Header border={true} headerTx="notificationDetailScreen.notificationDetail" leftIcon={true} onLeftPress={()=>navigation.goBack()} />
          <Notificationdetail data={item} />
        </Screen>
      )
})
