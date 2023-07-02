import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { FormControl, Header, Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
const ROOT: ViewStyle = {
  flex: 1,
}
export const DetailsRequestScreen: FC<StackScreenProps<HomeStackParamsList, "detailsrequest">> = observer(function DetailsRequestScreen({navigation,route}) {
   
  return (
    <Screen style={ROOT} preset="scroll" statusBar="light-content">
           <Header headerText="CHI TIẾT ĐƠN" border={true}titleStyle={{ color: color.storybookDarkBg }} leftIcon={true}
        onLeftPress={() => { navigation.goBack() }} />
           <FormControl data={route.params} />
    </Screen>
  )
})
