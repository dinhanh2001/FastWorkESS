import * as React from "react"
import { useState } from "react"
import { useStores } from "../../models"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"
import { Text } from "../text/text"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AntDesign from "@expo/vector-icons/AntDesign"
import { Actionsheet, useDisclose, Box, Avatar, VStack, useToast } from "native-base"
import { ModalLoader } from "../modal-loader/modal-loader"
import { ToastMessage } from "../toast-message/toast-message"
// const userAvatar = require("../../../assets/images/userAvt.png")

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface PickImageProps {
  /**
   * An optional style override useful for padding & margin.
   */
  uri?: string,
  style?: StyleProp<ViewStyle>
  update?(e): void
}

/**
 * Describe your component here
 */
export const PickImage = observer(function PickImage(props: PickImageProps) {
  const { style, uri, update } = props
  const styles = Object.assign({}, CONTAINER, style)
  const [image, setImage] = useState(null)
  const { userStore } = useStores()
  const { isOpen, onOpen, onClose } = useDisclose();
  const [open, setOpen] = useState(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const toast = useToast()
  // Call api update avatar
  const updateAvatar = async (data) => {
    setIsUpdate(true)
    return await userStore
      .updateAvatar(data)
      .then((data: object) => {
        if (data) {
          if (data['kind'] === 'ok' && data['result']['data']['error'] == "") {
            console.log("data:", data['result']['data'])
            update(data['result']['data']['url'])
            setIsUpdate(false)
            toast.show({
              placement: "top",
              render: () => {
                return <ToastMessage tx="shared.success" type={"success"} />
              },
            })
          } else {
            toast.show({
              placement: "top",
              render: () => {
                return <ToastMessage tx="shared.error" type={"error"} subText={data['result']['data']['error']} />
              },
            })
            setIsUpdate(false)
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }
  // Image Picker handle
  const openCamera = async () => {
    // No permissions request is necessary for launching the image library
    setOpen(onClose);

    await launchCamera({
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: true
    },
      async (res) => {
        if (!res.didCancel) {
          const uri = res.assets[0].uri;
          const base64 = res.assets[0].base64;
          // console.log(res.assets[0].base64)
          setImage(uri)
          await updateAvatar({ image: base64 })
        }
        // console.log(res)
      });
  }
  const pickImage = async () => {
    // const [image, setImage] = useState(null) 
    setOpen(onClose);
    await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: true
    }, async (res) => {
      if (!res.didCancel) {
        const uri = res.assets[0].uri;
        const base64 = res.assets[0].base64;
        // console.log(res.assets[0].base64)
        setImage(uri)
        await updateAvatar({ image: base64 })
      }
    })
  }
  return (
    <View style={styles}>
      <VStack>
        <Avatar bg="amber.500" source={{
          uri: image ? image : ((uri == "/male.png" || uri == "/female.png") ? `http://beta.fastwork.vn:2005${uri}` : uri),
        }} size="2xl" maxW={120} maxH={120}>
          Avatar
        </Avatar>
        <Box style={{ position: "absolute", right: 0, bottom: 0, padding: 4, backgroundColor: "#2b87f2", zIndex: 1, borderRadius: 50, borderWidth: 3, borderColor: color.background }}>
          <AntDesign name="camerao" size={24} color={color.background} onPress={() => onOpen()} />
        </Box>
      </VStack>
      <Actionsheet isOpen={isOpen} onClose={open}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={openCamera} ><Text tx="profileScreen.camera" /></Actionsheet.Item>
          <Actionsheet.Item onPress={pickImage}><Text tx="profileScreen.library" /></Actionsheet.Item>
          <Actionsheet.Item onPress={onClose}><Text tx="profileScreen.cancel" /></Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      <ModalLoader caption={false} loading={isUpdate} />
    </View>
  )
})
