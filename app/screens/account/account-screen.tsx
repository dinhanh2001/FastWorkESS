import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { profileParamList } from "../../navigators"
import { Header, Screen, ProfileNav } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
const ROOT: ViewStyle = {
  flex: 1,
}

export const AccountScreen: FC<StackScreenProps<profileParamList, "profileNav">> = observer(
  function AccountScreen({navigation}) {
    return (
      <Screen style={ROOT} statusBar="dark-content" keyboardShouldPersistTaps="never" unsafe={true} keyboardOffset="none">
        <Header border={true} headerTx="profileScreen.headerText" />
        <ProfileNav navigation={navigation}/>
      </Screen>
    )
  },
)
