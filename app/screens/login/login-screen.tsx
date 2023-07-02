// import messaging from "@react-native-firebase/messaging"
import React, { useState, useLayoutEffect, useEffect } from "react"
import { observer } from "mobx-react-lite"
import {  ViewStyle } from "react-native"
import {
  Screen,
  Text,
  TextField,
  GradientBackground,
  Pressable,
  Spinner,
  Checkbox,
  AlertDialog,
} from "../../components"
import { useStores } from "../../models"
import { color } from "../../theme"
import { Box, HStack, Center, FormControl, Icon } from "native-base"
import * as storage from "../../utils/storage"
import { Feather } from "@expo/vector-icons"
import DeviceInfo from "react-native-device-info"
import { TxKeyPath } from "../../i18n"
import ModalSelector from "react-native-modal-selector-searchable"
const ROOT: ViewStyle = {
  flex: 1,
}
export const LoginScreen = observer(function LoginScreen() {
  const [username, setUserName] = useState<string>("")
  const [password, setPassWord] = useState<string>("")
  const [hidePassword, setHidePassword] = useState(true)
  const [messerror, setMesserror] = useState<string >("")
  //const [organization, setOrganization] = useState<string>("");
  const [dataOrganization, setDataOrganization] = useState([])
  const { authenticationStore, userStore } = useStores()
  const [isOpen, setIsOpen] = React.useState(false)
  const [deviceId, setDeviceId] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [device, setDevice] = useState(null)
  const onClose = () => setIsOpen(false)
  const OnLogin = async () => {
    if(username.length <1 || password.length <1){
      authenticationStore.setStatus("error")
      setMesserror("Sai tài khoản hoặc mật khẩu!!!")
    }
    else {
      const data =  authenticationStore.login(username, password, deviceId, phoneNumber, device)
      const listOrg = await data
      console.log("List Org: ", listOrg)
      if (listOrg) {
        if (typeof data === "object") {
          let dataOrg = listOrg.map((value, index) => {
            console.log("Go to func get data from org!")
            return {
              key: value["_id"],
              label: value["name"],
            }
          })
          setDataOrganization(dataOrg)
          setIsOpen(true)
          if (authenticationStore.savePassword) {
            storage.saveString("username", username)
            storage.saveString("password", password)
          } else {
            storage.remove("password")
            storage.remove("username")
          }
        } else {
          authenticationStore.setStatus("error")
          setMesserror(listOrg)
        }
      }else{
        console.log("Khong call đc API !")
      }
    }
  }
  useEffect(() => {
    if (authenticationStore.savePassword) {
      storage.loadString("password").then((data) => setPassWord(data))
      storage.loadString("username").then((data) => setUserName(data))
    }
    return () => {
      setPassWord(null)
      setUserName(null)
    }
  }, [])
  useEffect(() => {
    if (DeviceInfo) {
      setDeviceId(DeviceInfo.getUniqueIdSync() ? DeviceInfo.getUniqueIdSync() : null)
      setPhoneNumber(DeviceInfo.getSerialNumberSync() ? DeviceInfo.getSerialNumberSync() : null)
      setDevice(DeviceInfo.getBrand())
    }
    return () => {
      setDeviceId(null)
      setPhoneNumber(null)
      setDevice(null)
    }
  })

  const OnStorage = (value) => {
    authenticationStore.setSavePassword(value)
  }
  useLayoutEffect(() => {
    authenticationStore.resetStatus();
    return () => {
    }
  }, [authenticationStore]);
const setTenantId = async (option:string) =>{
  authenticationStore.environment.setTenantId(option['key'])
  setDataOrganization(null)
  onClose()
  authenticationStore.setAuthentication(true)
  let tenantId =  storage.load("tenantId")
  let cloudId =  storage.loadString("cloudId")
  let tenantID = await tenantId
  let cloudID = await cloudId
  userStore.getCurrentUser()
}
  return (

    <Screen style={ROOT} preset="fixed" statusBar="dark-content" keyboardShouldPersistTaps="handled" unsafe={true} keyboardOffset="none">
      <GradientBackground colors={["#308AF3", "#4B65DF"]} />
      <Box m={2}>
        <Box h={150}>
          <HStack justifyContent="center">
            <Center w={"100%"}>
              <Text tx="loginScreen.productBy" textAlign="center" fontSize={"3xl"} color="white" />

              <Text
                tx="loginScreen.nameProduct"
                textAlign="center"
                fontWeight="bold"
                fontSize={"3xl"}
                paddingX="0.5"
                color="white"
              />
            </Center>
          </HStack>
        </Box>
        <Box>
          <FormControl>
            <TextField
              placeholderTx="loginScreen.username"
              labelTx="loginScreen.username"
              value={username}
              onChangeText={(valueUser) => setUserName(valueUser)}
              placeholderTextColor={"#ccc"}
              textColor={color.backGroundView}
            />
          </FormControl>

          <FormControl>
            <TextField
              placeholder="*********"
              labelTx="loginScreen.password"
              value={password}
              textColor={color.backGroundView}
              onChangeText={(valuePass) => setPassWord(valuePass)}
              placeholderTextColor={"#ccc"}
              secureTextEntry={hidePassword ? true : false}
              InputRightElement={
                hidePassword ? (
                  <Icon
                    onPress={() => setHidePassword(false)}
                    m="2"
                    mr="3"
                    size="6"
                    color="gray.400"
                    as={<Feather name="eye" size={25} color={color.background} />}
                  />
                ) : (
                  <Icon
                    onPress={() => setHidePassword(true)}
                    m="2"
                    mr="3"
                    size="6"
                    color="gray.400"
                    as={<Feather name="eye-off" size={25} color={color.background} />}
                  />
                )
              }
              
            />
          </FormControl>

          <Checkbox
            defaultIsChecked={authenticationStore.savePassword}
            value="Save"
            tx="loginScreen.saveAccount"
            textColor={color.background}
            colorScheme={"info"}
            size={"md"}
            onChange={(value: boolean) => {
              OnStorage(value)
            }}
            mb="5"
          />
          {/* <Text tx="loginScreen.forgotPassword" textAlign={"right"} color={color.buttstart} marginBottom={"4"} /> */}
          {authenticationStore.status === "pending" ? (
            <Spinner tx="loginScreen.loading" color={"white"} bg="tertiary.500"  />
          ) : (
            <Pressable tx="loginScreen.login" onPress={OnLogin}  />
          )}
          {authenticationStore.status === "error" ? (
            <AlertDialog value={true}  messerr={messerror} />
          ) : (
            <Box />
          )}
        </Box>
      </Box>
      <Center>
        <ModalSelector
          data={dataOrganization}
          initValue={""}
          onChange={(option) => {
            setTenantId(option)
            // userStore.setEmail(username)
            // authenticationStore.environment.settenantId(option["key"])
            // setDataOrganization(null)
            // onClose()
            // authenticationStore.setAuthentication(true)
          }}
          visible={isOpen}
          renderItem={(info) => {
            return <Text color={"black"} text={`${info["index"]}`} key={info.index} />
          }}
          caseSensitiveSearch={true}
          touchableActiveOpacity={0}
          onCancel={onClose}
          animationType="none"
          searchText={`Tìm kiếm`}
          cancelText={"Đóng"}
          cancelStyle={{
            backgroundColor: color.success,
          }}
          cancelTextStyle={{
            color: color.background,
          }}
        >
          <Text text="" />
        </ModalSelector>
      </Center>
    </Screen>
  )
})
