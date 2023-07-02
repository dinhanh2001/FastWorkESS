import * as React from "react"
import { useEffect, useState } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../../theme"
import { Box, Center, HStack, ScrollView } from "native-base"
import { spacing } from "../../../theme"
import AntDesign from "@expo/vector-icons/AntDesign"
import { profileParamList } from "../../../navigators"
import { useStores } from "../../../models"
import { StackNavigationProp } from "@react-navigation/stack"
import { version } from "../../../utils/versionInfo"
import {
  SkeletonItemlist,
  ItemList,
  SkeletonProfileNav,
  PickImage,
  Text,
  ChangeLanguage,
  ChangePassword,
} from "../../../components"
import { load, loadString } from "../../../utils/storage"
import i18 from "i18n-js"
// import { ToastMessage } from "../../toast-message/toast-message"
const CONTAINER: ViewStyle = {
  justifyContent: "center",
  marginBottom: 50,
}

export interface ProfileNavProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  navigation?: StackNavigationProp<profileParamList>
}

/**
 * Describe your component here
 */
export const ProfileNav = observer(function ProfileNav(props: ProfileNavProps) {
  const { style, navigation } = props
  const styles = Object.assign({}, CONTAINER, style)
  const { authenticationStore, userStore } = useStores()
  // const [infoUser, setInfoUser] = useState<any>({})
  const [skeleton, setSkeleton] = useState<boolean>(false)
  const [changeLanguage, setChangeLanguage] = useState<boolean>(false)
  const [changePassword, setChangePassword] = useState<boolean>(false)
  const [language, setLanguage] = useState<string>("")
  // Call API get infomation of current user
  const getLanguage = async () => {
    console.log("Cleanup function")
    const lg = await loadString("language")
    if (lg) {
      setLanguage(lg)
    } else {
      const locale = i18.locale.split("-")[0]
      setLanguage(locale)
    }
    if (!data["name"]) {
      setSkeleton(true)
    } else {
      setSkeleton(false)
    }
  }

  const updateAvatar = async (e) => {
    await userStore.updateProfile({ avatar: e })
    console.log(e)
  }
  const data = userStore
  useEffect(() => {
    getLanguage()
    return () => {}
  }, [])
  // Log out handle
  const OnlogOut = async () => {
    let tenantId = await load("tenantId")
    let cloudId = await loadString("cloudId")
    if (cloudId) {
      userStore.resgisterFireBase(userStore.email, tenantId, "")
    }
    authenticationStore.logout()
  }
  const onClose = (d) => {
    setChangeLanguage(d)
    setChangePassword(d)
  }
  // console.log( `http://beta.fastwork.vn:2005${infoUser.avatar}`)
  return (
    <>
      <View style={styles}>
        <ScrollView>
          {skeleton ? (
            <SkeletonProfileNav />
          ) : (
            <Box marginX="10">
              <Box bgColor={color.background} paddingBottom="5">
                <Center>
                  <PickImage uri={data["avatar"]} update={updateAvatar} />
                  <HStack alignItems={"center"}>
                    <Text fontWeight={"bold"} text={data["name"]} fontSize={spacing[5]} />
                    {/* <Text text="  -ID : 19012" /> */}
                  </HStack>
                  <Text text={data["position"]} fontSize={spacing[4]} />
                </Center>
              </Box>
            </Box>
          )}
          <Text
            tx="profileScreen.user"
            fontWeight={"bold"}
            color={color.dim}
            marginX={"5%"}
            marginTop={4}
          ></Text>
          <Box>
            {skeleton ? (
              <SkeletonItemlist icons={true} style={{ width: 300 }} />
            ) : (
              <ItemList
                tx="profileScreen.employ"
                fontWeight={"bold"}
                onPress={() => {
                  navigation.navigate("profileDetails")
                }}
                arrowRight={true}
                image={true}
                icon={<AntDesign name="user" size={24} color="black" />}
              />
            )}
          </Box>
          <Text
            tx="profileScreen.settings"
            fontWeight={"bold"}
            color={color.dim}
            marginX={"5%"}
            marginTop={4}
          ></Text>
          <Box>
            <ItemList
              tx="profileScreen.language"
              fontWeight={"bold"}
              arrowRight={true}
              image={true}
              icon={<AntDesign name="earth" size={24} color="black" />}
              onPress={() => {
                setChangeLanguage(true)
              }}
            />
            <ItemList
              tx="profileScreen.changePassword"
              fontWeight={"bold"}
              arrowRight={true}
              image={true}
              icon={<AntDesign name="edit" size={24} color="black" />}
              onPress={() => {
                setChangePassword(true)
              }}
            />
            <ItemList
              tx="profileScreen.verInfo"
              fontWeight={"bold"}
              arrowRight={false}
              image={true}
              text={version}
              icon={<AntDesign name="infocirlceo" size={24} color="black" />}
            />
            <ItemList
              tx="profileScreen.logout"
              fontWeight={"bold"}
              onPress={OnlogOut}
              arrowRight={true}
              image={true}
              icon={<AntDesign name="logout" size={24} color="black" />}
            />
          </Box>
          {/* <ModalLoader caption={false} loading={skeleton}/> */}
          {changeLanguage ? (
            <ChangeLanguage
              isChange={true}
              languageStorage={language}
              passing={() => {
                onClose(false)
              }}
            />
          ) : null}
          {changePassword ? (
            <ChangePassword
              isChange={true}
              passing={() => {
                onClose(false)
              }}
            />
          ) : null}
          {/* <ToastMessage placement="top" text="OK!"/> */}
        </ScrollView>
      </View>
    </>
  )
})
