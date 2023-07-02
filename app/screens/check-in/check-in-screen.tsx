import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { Header, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  flex: 1,
}

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `checkIn: undefined` to HomeStackParamsList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="checkIn" component={CheckInScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const CheckInScreen: FC<StackScreenProps<HomeStackParamsList, "checkIn">> = observer(function CheckInScreen({navigation}) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="scroll">
       <Header leftIcon={true} headerText="Xin giải trình" border={true} titleStyle={{ color: color.storybookDarkBg }}
        onLeftPress={() => { navigation.goBack() }} />
        
    </Screen>
  )
})
