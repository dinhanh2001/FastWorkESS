import * as React from "react"
import { useState } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../../theme"
import { ScrollView, Stack, FormControl, Input, TextArea, VStack, useToast } from "native-base"
import { StackNavigationProp } from "@react-navigation/stack"
import { profileParamList } from "../../../navigators"
import { useStores } from "../../../models"
import { validators } from "../../../utils/validate"
import { dateYMD } from "../../../utils/common"
import {
  ModalLoader,
  DatePicker,
  SelectOptions,
  Pressable,
  Text,
  ToastMessage,
  Spinner,
} from "../../../components"

const CONTAINER: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
  flexDirection: "column",
  justifyContent: "flex-start",
}

export interface EmployeeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  navigation?: StackNavigationProp<profileParamList>
}

/**
 * Describe your component here
 */
export const Employee = observer(function Employee(props: EmployeeProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)
  // Gọi hàm call api từ service
  const { userStore } = useStores()
  const toast = useToast()
  let user = userStore
  // user=user['result']
  // Define variable for edit profile
  const [name, setName] = useState<string>(user["name"])
  const [email, setEmail] = useState<string>(user["email2"])
  const [phone, setPhone] = useState<string>(user["phone"])
  const [birthday, setBirthday] = useState(user["birthday"])
  const [gender, setGender] = useState<string>(user["gender"])
  const [address, setAddress] = useState<string>(user["address"])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const onPassing = (e) => {
    setBirthday(e)
  }
  const dataSelect = [
    { value: "Nam", name: "Nam" },
    { value: "Nữ", name: "Nữ" },
    { value: "Khác", name: "Khác" },
  ]
  //  Xử lí cập nhật thông tin người dùng
  const dataUpdate = {
    email2: email,
    phone,
    birthday: new Date(birthday).getTime(),
    // birthday,
    gender,
    address,
    name,
  }
  const updateUser = async () => {
    setIsLoading(true)
    const user = await userStore.updateProfile(dataUpdate)
    console.log("dataa posst: ", dataUpdate)
    setIsLoading(false)
    if (!user["result"]) {
      setIsLoading(false)
      // alert(user["kind"])
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage tx="shared.error" type={"error"} subText={user["message"]}/>
        },
      })
    } else {
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage tx="shared.success" type={"success"} subText="Cập nhật thành công!" />
        },
      })
    }
  }
  return (
    <View style={styles}>
      <ScrollView w="100%">
        <Stack
          space={2.5}
          alignSelf="center"
          px="4"
          safeArea
          mt="4"
          w={{
            base: "100%",
            md: "25%",
          }}
        >
          <VStack>
            <FormControl isDisabled mb="3">
              <FormControl.Label
                _disabled={{
                  _text: {
                    color: "gray.400",
                    fontWeight: "bold",
                  },
                }}
              >
                <Text tx="profileScreen.code" />
              </FormControl.Label>
              <Input defaultValue={user["email"]} placeholder="Title" />
            </FormControl>
          </VStack>
          <VStack>
            <FormControl isRequired mb="3">
              <FormControl.Label
                _disabled={{
                  _text: {
                    color: "gray.400",
                    fontWeight: "bold",
                  },
                }}
              >
                <Text tx="profileScreen.fullName" />
              </FormControl.Label>
              <Input
                defaultValue={user["name"]}
                placeholder="Title"
                onChangeText={(value) => {
                  setName(value)
                }}
              />
              {validators("name", name) ? (
                <FormControl.HelperText>
                  <Text text={validators("name", name)} color={color.primary} />
                </FormControl.HelperText>
              ) : null}
            </FormControl>
          </VStack>
          <VStack>
            <FormControl mb="3">
              <FormControl.Label>
                <Text tx="profileScreen.email" />
              </FormControl.Label>
              <Input
                defaultValue={user["email2"]}
                placeholder="Email 2"
                onChangeText={(value) => {
                  setEmail(value)
                }}
              />
              {validators("email", email) ? (
                <FormControl.HelperText>
                  <Text text={validators("email", email)} color={color.primary} />
                </FormControl.HelperText>
              ) : null}
            </FormControl>
          </VStack>
          <VStack>
            <FormControl mb="3">
              <FormControl.Label>
                <Text tx="profileScreen.phoneNumber" />
              </FormControl.Label>
              <Input
                defaultValue={user["phone"]}
                placeholder="Phone number"
                keyboardType="phone-pad"
                onChangeText={(value) => {
                  setPhone(value)
                }}
              />
              {validators("phone", phone) ? (
                <FormControl.HelperText>
                  <Text text={validators("phone", phone)} color={color.primary} />
                </FormControl.HelperText>
              ) : null}
            </FormControl>
          </VStack>
          <VStack>
            <FormControl mb="3">
              <FormControl.Label>
                <Text tx="profileScreen.birthday" />
              </FormControl.Label>
              <DatePicker defaultValue={birthday ? dateYMD(birthday) : ""} onPassing={onPassing} />
            </FormControl>
          </VStack>
          <VStack>
            <FormControl mb="3">
              <FormControl.Label>
                <Text tx="profileScreen.gender" />
              </FormControl.Label>
              <SelectOptions
                onValueChange={(e: string) => {
                  setGender(e)
                }}
                selectedVal={gender}
                arrValue={dataSelect}
              />
            </FormControl>
          </VStack>
          <VStack>
            <FormControl mb="3">
              <FormControl.Label>
                <Text tx="profileScreen.addr" />
              </FormControl.Label>
              {/* <Input defaultValue={email} placeholder="Email 2" onChangeText={(value)=> {setEmail(value)}}/> */}
              <TextArea
                // autoComplete="street-address"
                h={20}
                value={user["address"]}
                onChangeText={(value) => {
                  setAddress(value)
                }}
                placeholder="Please type your address"
                w="100%"
              />
            </FormControl>
          </VStack>
          <VStack>
            <FormControl isDisabled mb="3">
              <FormControl.Label>
                <Text tx="profileScreen.dateStartWork" />
              </FormControl.Label>
              <Input
                defaultValue={user["ngay_vao_chinh_thuc"]}
                // placeholderTx="profileScreen.dateStartWork"
              />
            </FormControl>
          </VStack>
        </Stack>
        <VStack marginX={"5%"} marginBottom={"5%"}>
          {userStore.status == "pending" ? (
            <Spinner tx="loginScreen.loading" color={"white"} bg="tertiary.500" />
          ) : (
            <Pressable
              tx="profileScreen.updateInfo"
              color="black"
              onPress={async () => {
                userStore.setStatus("pending")
                await updateUser()
                // alert("Cập nhật thông tin!")
              }}
            />
          )}
        </VStack>
        <ModalLoader caption={false} loading={isLoading} />
      </ScrollView>
    </View>
  )
})
