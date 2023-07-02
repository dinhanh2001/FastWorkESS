import * as React from "react"
import { Pressable, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../../text/text"
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { Box, HStack, Image } from "native-base"
import { Screen } from "../../screen/screen"
import { useStores } from "../../../models"
import { AntDesign } from "@expo/vector-icons"
import { color } from "../../../theme"
import { load, loadString } from "../../../utils/storage"
import { ChangePassword } from "../../profile/change-password/change-password"
export interface DrawerCustomProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const DrawerCustom = observer(function DrawerCustom(props) {
  const { authenticationStore, userStore } = useStores()
  const [open,isOpen] = React.useState(false)
  const OnlogOut = async () => {
    let tenantId = await load("tenantId")
    let cloudId = await loadString("cloudId")
    if (cloudId) {

      userStore.resgisterFireBase(userStore.email, tenantId, "")
    }
    authenticationStore.logout()
  }

  const onChangePassword = () => {
        isOpen(true)
  }
  return (
    <Screen preset="fixed" >
      <DrawerContentScrollView {...props} >
        <Box padding={"10%"}>
          <Image size={150} resizeMode={"contain"} borderRadius={100} source={{
            uri: authenticationStore.image
          }} alt="Alternate Text" />
          <HStack flexDirection={"row"} marginY={1}  >
            <Text fontWeight={"bold"} text="Tên : " />
            <Text ml="1" fontWeight={"bold"} text={authenticationStore.name} />

          </HStack>
        </Box>
        {/* <DrawerItemList navigation={undefined} state={undefined} descriptors={undefined} {...props} /> */}
        <Pressable onPress={onChangePassword} >
          <HStack marginX={"5%"} mb="2" borderRadius={5} alignItems="center" bg={color.buttend} py="2" px="2" justifyContent={"space-between"} >
            <HStack alignItems={"center"}>
              <AntDesign name="logout" size={24} color={color.background} />
              <Text text="Change password" color={color.background} ml="1" />
            </HStack>
            <AntDesign name="arrowright" size={24} color={color.background} />
          </HStack>
        </Pressable>
        <Pressable onPress={OnlogOut}>
          <HStack marginX={"5%"}  borderRadius={5} alignItems="center" bg={color.buttend} py="2" px="2" justifyContent={"space-between"} >
            <HStack alignItems={"center"}>
              <AntDesign name="logout" size={24} color={color.background} />
              <Text text="Log Out" color={color.background} ml="1" />
            </HStack>
            <AntDesign name="arrowright" size={24} color={color.background} />
          </HStack>
        </Pressable>
      </DrawerContentScrollView>
      {open && <ChangePassword isChange={open} passing={(e)=>{isOpen(false)}} /> }
    </Screen>
  )
})
