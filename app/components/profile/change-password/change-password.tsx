import * as React from "react"
import { useState } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../../text/text"
import { Modal, Button, FormControl, Input, Icon, useToast } from "native-base"
import { Feather } from "@expo/vector-icons"
import { color } from "../../../theme"
import { useStores } from "../../../models"
import { ModalLoader } from "../../modal-loader/modal-loader"
import { ToastMessage } from "../../toast-message/toast-message"
import { validators } from "../../../utils/validate"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface ChangePasswordProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  isChange?: boolean
  passing?(e): void
}

/**
 * Describe your component here
 */
export const ChangePassword = observer(function ChangePassword(props: ChangePasswordProps) {
  const { style, isChange, passing } = props
  const styles = Object.assign({}, CONTAINER, style)
  const [hidePassword, setHidePassword] = useState<boolean>(true)
  const [hidePassword2, setHidePassword2] = useState<boolean>(true)
  const [hidePassword3, setHidePassword3] = useState<boolean>(true)
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [retypePassword, setRetypePassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { authenticationStore } = useStores()
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isFocused1, setIsFocused1] = useState<boolean>(false)
  const [isFocused2, setIsFocused2] = useState<boolean>(false)
  const toast = useToast()

  const changeHandle = async () => {
    // console.log("tesst")
    if (currentPassword == "") {
      toast.show({
        placement:"top",
        render: () => {
          return <ToastMessage tx="shared.warning" subTx="profileScreen.curentPasswordMessage" type={"warning"} />
        }})
    } else if (newPassword == "") {
      toast.show({
        placement:"top",
        render: () => {
          return <ToastMessage tx="shared.warning" subTx="profileScreen.newPasswordMessage" type={"warning"} />
        }})
    } else if (retypePassword == "") {
      toast.show({
        placement:"top",
        render: () => {
          return <ToastMessage tx="shared.warning" subTx="profileScreen.retypePasswordMessage" type={"warning"} />
        }})
    } else if (newPassword != retypePassword) {
      toast.show({
        placement:"top",
        render: () => {
          return <ToastMessage tx="shared.warning" subTx="profileScreen.passwordMessage" type={"warning"} />
        }})
    } else {
      await onChange()
    }
  }

  const onChange = async () => {
    setIsLoading(true)
    const result = await authenticationStore.changePassword(currentPassword, newPassword)
    console.log("result", result)
    if (result.result) {
      passing(false)
      setIsLoading(false)
      toast.show({
        placement:"top",
        render: () => {
          return <ToastMessage tx="shared.success" subTx="profileScreen.updateSuccessful" type={"success"} />
        }})
    } else if (result.result == false) {
      setIsLoading(false)
      console.log(result)
      alert(result.message)
    }
  }

  return (
    <View style={styles}>
      <Modal closeOnOverlayClick={false} isOpen={isChange} onClose={() => passing(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            <Text tx="profileScreen.changePassword" />
          </Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <FormControl.Label>
                <Text tx="profileScreen.curentPassword" />
              </FormControl.Label>
              <Input
                secureTextEntry={hidePassword ? true : false}
                value={currentPassword}
                onChangeText={(valuePass) => setCurrentPassword(valuePass)}
                onFocus={() => {
                  setIsFocused(true)
                }}
                onBlur={() => {
                  setIsFocused(false)
                }}
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
              {isFocused &&
                (validators("password", currentPassword) ? (
                  <FormControl.HelperText>
                    <Text tx="profileScreen.curentPasswordMessage" color={color.primary} />
                  </FormControl.HelperText>
                ) : null)}
            </FormControl>
            <FormControl mt="3" isRequired>
              <FormControl.Label>
                <Text tx="profileScreen.newPassword" />
              </FormControl.Label>
              <Input
                secureTextEntry={hidePassword2 ? true : false}
                value={newPassword}
                onChangeText={(value) => setNewPassword(value)}
                onFocus={() => {
                  setIsFocused1(true)
                }}
                onBlur={() => {
                  setIsFocused1(false)
                }}
                InputRightElement={
                  hidePassword2 ? (
                    <Icon
                      onPress={() => setHidePassword2(false)}
                      m="2"
                      mr="3"
                      size="6"
                      color="gray.400"
                      as={<Feather name="eye" size={25} color={color.background} />}
                    />
                  ) : (
                    <Icon
                      onPress={() => setHidePassword2(true)}
                      m="2"
                      mr="3"
                      size="6"
                      color="gray.400"
                      as={<Feather name="eye-off" size={25} color={color.background} />}
                    />
                  )
                }
              />
              {isFocused1 &&
                (validators("password", newPassword) ? (
                  <FormControl.HelperText>
                    <Text tx="profileScreen.newPasswordMessage" color={color.primary} />
                  </FormControl.HelperText>
                ) : null)}
            </FormControl>
            <FormControl mt="3" isRequired>
              <FormControl.Label>
                <Text tx="profileScreen.retypePassword" />
              </FormControl.Label>
              <Input
                secureTextEntry={hidePassword3 ? true : false}
                value={retypePassword}
                onChangeText={(valuePass) => setRetypePassword(valuePass)}
                onFocus={() => {
                  setIsFocused2(true)
                }}
                onBlur={() => {
                  setIsFocused2(false)
                }}
                InputRightElement={
                  hidePassword3 ? (
                    <Icon
                      onPress={() => setHidePassword3(false)}
                      m="2"
                      mr="3"
                      size="6"
                      color="gray.400"
                      as={<Feather name="eye" size={25} color={color.background} />}
                    />
                  ) : (
                    <Icon
                      onPress={() => setHidePassword3(true)}
                      m="2"
                      mr="3"
                      size="6"
                      color="gray.400"
                      as={<Feather name="eye-off" size={25} color={color.background} />}
                    />
                  )
                }
              />
              {isFocused2 &&
                (validators("password", retypePassword) ? (
                  <FormControl.HelperText>
                    <Text tx="profileScreen.retypePasswordMessage" color={color.primary} />
                  </FormControl.HelperText>
                ) : null)}
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  passing(false)
                }}
              >
                <Text tx="profileScreen.cancel" />
              </Button>
              <Button
                onPress={() => {
                  changeHandle()
                }}
              >
                <Text color={color.background} tx="profileScreen.save" />
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <ModalLoader loading={isLoading} />
    </View>
  )
})
