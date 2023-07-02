import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { profileParamList } from "../../navigators"
import { Screen, Header, Employee } from "../../components"
import { useStores } from "../../models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
// import { color } from "../../theme"

export let show = true;

const ROOT: ViewStyle = {
  flex: 1,
}

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `profileDetails: undefined` to NavigatorParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="profileDetails" component={ProfileDetailsScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const ProfileDetailsScreen: FC<StackScreenProps<profileParamList, "profileDetails">> = observer(
  function ProfileDetailsScreen({ navigation}) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const { userStore} = useStores()

  // console.log("Data passing",user.position)
  return (
    <Screen style={ROOT} statusBar="dark-content">
      <Header border={true} headerText={userStore['name']} leftIcon={true} onLeftPress={()=>{navigation.goBack(); show= true}}/>
      <Employee/>
    </Screen>
  )
})
