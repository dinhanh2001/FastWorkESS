import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Dimensions } from "react-native"
import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import { useStores } from "../../models"
import { AntDesign } from "@expo/vector-icons"
import { Pressable as PressableCT } from "../pressable/pressable"
import {
  Modal,
  Button,
  useToast,
  VStack,
  HStack,
  Image,
} from "native-base"
import { Map } from "../map/map"
import * as checkinConfig from "../../utils/checkin"
import { getCurrentPosition, getDistanceFromLatLon } from "../../utils/gps"
import { MenuSelect } from "../menu-select/menu-select"
import { ButtonDisabled } from "../button-disabled/button-disabled"
import { ToastMessage } from "../toast-message/toast-message"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TextError: TextStyle = {
  color: "red",
  fontWeight: "bold",
}

export interface ModalCheckinProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  place?: object
  ca?: object
  onExit ?(e: boolean): void
  choiceShift ?: Array<object>
}

/**
 * Describe your component here
 */
export const ModalCheckin = observer(function ModalCheckin(props: ModalCheckinProps) {
  const { style, place, ca, onExit, choiceShift } = props
  const styles = Object.assign({}, CONTAINER, style)
  // const [isOpen, setIsOpen] = useState<boolean>(true)
  // const [ lastActivities, setLastActivities ] = useState(null)
  // const [networkStatus, setNetworkStatus] = useState(null)
  // const { isConnected } = useNetInfo()
  const { TimesheetStore } = useStores()
  const [photo, setPhoto] = useState<object>({ uri: null })
  const [allowCheckin, setAllowCheckin] = useState<object>({})
  const [allowPicture, setAllowPicture] = useState<boolean>(true)
  const [faceVerify, setFaceVerify] = useState<object>({})
  const [data, setData] = useState<object>()
  // const [arrayFormat, setArrayFormat] = useState([])
  // const [position, setPosition] = useState<object>({})
  const [address, setAddress] = useState<object>({})
  const [networkInfo, setNetworkInfo] = useState<object>({})
  const [shiftSelected, setShiftSelected] = useState(null)
  const toast = useToast()
 
  // Function listen changing from location
  const onGoing = (location: object) => {
    const result = checkinConfig.distance(Object.assign(location, place))
    const distance = getDistanceFromLatLon(
      place["lat"],
      place["long"],
      location["coords"]["latitude"],
      location["coords"]["longitude"],
    )
    // console.log("Khoangr casch: ", result)
    if (result["distance"] != address["distance"]) {
      console.log("set Address!")
      setAddress(result)
    }
  }

  const onChangeSelect = async (e: object) => {
    setShiftSelected(e)
    isAllowCheckin(e)
    getDataPost(e, place)
  }
  
  const isAllowNetWork = async (place: object) => {
    const network = checkinConfig.network(place)
    console.log("network", network)
    setNetworkInfo(network)
  }

    
  const isAllowCheckin = (ca: object) => {
    const allowCheckin = checkinConfig.allowCheckin(ca)
    setAllowCheckin(allowCheckin)
  }

  const getDataPost = (ca: object, place: object) => {
    const dataPost = checkinConfig.dataPost(ca, place)
    setData(dataPost)
  }

  const openCamera = async (ca: object, place: object) => {
    console.log("Open camera!")
    const picture = await checkinConfig.picture(place)
    // console.log("picture result: ", picture['uri']);

    setPhoto(picture)
    const dataPost = checkinConfig.dataPost(ca, place)
    if (picture.base64 != null && typeof picture.base64 == "string") {
      // console.log(`data:image/jpeg;base64,${picture.base64}`)
      const result = await TimesheetStore.faceVerify(`data:image/jpeg;base64,${picture.base64}`)
      console.log("List key result camera: ", {
        isIdentical: result["result"]["isIdentical"],
        confidence: result["result"]["confidence"],
      })
      if (result["result"]) {
        if (result["result"]["isIdentical"] == true || result["result"]["confidence"] > 0.5) {
          setAllowPicture(true)
        } else {
          setAllowPicture(false)
        }
        dataPost["photo"] = result["result"]["imagename"]
        setFaceVerify({
          isIdentical: result["result"]["isIdentical"],
          confidence: result["result"]["confidence"],
        })
      } else {
        setAllowPicture(false)
      }
    } else if (picture.err) {
      console.log("picture", picture)
      // onShow(false)
    }
  }

  const onCheckin = async () => {
    if (allowCheckin["pass"] == true && networkInfo['pass'] == true && allowPicture == true) {
      const response = await TimesheetStore.checkin(data)
    } else {
      console.log({ allowCheckin: allowCheckin["pass"], networkInfo: networkInfo['pass'], allowPicture })
      toast.show({
        placement: "top",
        render: () => {
          return (
            <ToastMessage
              tx="shared.error"
              type={"error"}
              subText={"Vui lòng kiểm tra các điều kiện để được phép chấm công!"}
            />
          )
        },
      })
    }
  }

  const isAllowPicture = async (place: object) => {
    const picture = checkinConfig.checkPicture(place)
    setAllowPicture(picture)
  }

  useEffect(() => {
    const func = (place: object, ca: object) => {
      isAllowCheckin(ca)
      isAllowNetWork(place)
      isAllowPicture(place)
      // setIsOpen(false)
      getDataPost(ca, place)
      // setShowModal(true)
      const distance = checkinConfig.distance(place);
      setAddress(distance)
    }
    func(place, ca)
  },[])

  useEffect(()=>{
    
  }, [address])
  return (
    <View style={styles}>
      <Modal
          isOpen={true}
          onClose={() => onExit(false)}
          _backdrop={{
            _dark: {
              bg: "coolGray.800",
            },
            bg: "warmGray.50",
          }}
          size="full"
          height="full"
          closeOnOverlayClick={false}
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>
              <Text text={place["text"]} />
            </Modal.Header>
            <Modal.Body>
              <VStack>
                <Map
                  style={{ flex: 6, minHeight: 120, maxHeight: 300, height: Dimensions.get("window").height * 0.3 }}
                  position={place}
                  onUpdate={onGoing}
                />
                {address["pass"] == true ? (
                  <Text text="Vị trí được phép chấm công!" />
                ) : (
                  <Text
                    text={`Bạn đang ở cách vị trí chấm công ${address["distance"]}${address["unit"]}, Bạn có chắc muốn thực hiện chấm công tại đây, bán kính cho phép chấm công là ${address["r"]}m`}
                    style={TextError}
                  />
                )}
              </VStack>
              <HStack style={{ height: 50, alignItems: "center", marginTop: 10 }}>
                <Text
                  text={
                    shiftSelected
                      ? `Ca được chọn: ${shiftSelected["ten"]}`
                      : ca
                      ? `Ca được phân: ${ca['ten']}`
                      : "Chưa được phân ca"
                  }
                  style={{ flex: 1 }}
                />
                {place["choiceShift"] == true ? (
                  <MenuSelect
                    tx="checkinScreen.chooseShift"
                    arrValue={choiceShift}
                    title="checkinScreen.chooseShift"
                    type="radio"
                    onChange={onChangeSelect}
                    defaultValue={
                      shiftSelected
                        ? shiftSelected["ma"]
                        : ca
                        ? ca['ma']
                        : null
                    }
                    style={{ flex: 1 }}
                  />
                ) : null}
              </HStack>

              {networkInfo['pass'] == false ? (
                <VStack style={{ marginTop: 10 }}>
                  <Text
                    text={`Sai địa chỉ ${networkInfo["type"]}`}
                    fontWeight="bold"
                    style={TextError}
                  />
                  <Text
                    text={`Địa chỉ Cho phép là: ${networkInfo["networkAllow"][0]["value"]}`}
                    style={TextError}
                  />
                  <Text text={`Địa chỉ của bạn là: ${networkInfo["address"]}`} style={TextError} />
                  <Text
                    text={`Tên mạng Cho phép là: ${networkInfo["networkAllow"][0]["label"]}`}
                    style={TextError}
                  />
                  <Text text={`Địa chỉ của bạn là: ${networkInfo["name"]}`} style={TextError} />
                </VStack>
              ) : null}

              <HStack>
                {allowPicture ? null : (
                  <>
                    <HStack style={{ marginTop: 10 }}>
                      <VStack style={{ alignItems: "center", justifyContent: "center" }}>
                        <Button
                          onPress={async () => {
                            await openCamera(
                              shiftSelected ? shiftSelected : place["shift_ca"],
                              place,
                            )
                          }}
                        >
                          <AntDesign name="camera" size={30} color="white" style={{ padding: 7 }} />
                        </Button>
                        <Text text="Chụp ảnh" />
                      </VStack>
                      {photo["uri"] ? (
                        <Image
                          size={{base: 100, sm: 120, md: 150}}
                          style={{ marginHorizontal: 5 }}
                          source={{
                            uri: photo["uri"],
                          }}
                          alt="Image"
                        />
                      ) : null}
                      {faceVerify["isIdentical"] == false && faceVerify["confidence"] < 0.5 ? (
                        <Text
                          text="Ảnh vừa chụp không tương thích, vui lòng chụp lại!"
                          style={{fontWeight: "bold", color: "red.500", width: "40%", maxWidth: 250}}
                          fontSize={{base: 'md', md: 'lg', lg: 'xl'}}
                        />
                      ) : null}
                    </HStack>
                  </>
                )}
                {faceVerify["isIdentical"] == true || faceVerify["confidence"] > 0.5 ? (
                  <VStack>
                    <Image
                      size={{base: 100, sm: 120, md: 150}}
                      style={{ marginHorizontal: 5 }}
                      source={{
                        uri: photo["uri"],
                      }}
                      alt="Image"
                    />
                    <Text
                      text="Ảnh chụp chấm công hợp lệ!"
                      style={{ fontWeight: "bold", color: "green" }}
                    />
                  </VStack>
                ) : null}
              </HStack>
              {allowCheckin["pass"] ? null : (
                <HStack style={{ height: 50, alignItems: "center", marginTop: 10 }}>
                  {allowCheckin["pass"] == false && allowCheckin["err"] ? (
                    <Text text="Vui lòng chọn ca làm việc!" style={TextError} />
                  ) : (
                    <Text
                      text={`Ca làm việc hiện tại bắt đầu vào lúc ${allowCheckin["timeStart"]}`}
                      style={TextError}
                    />
                  )}
                </HStack>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    onExit(false)
                  }}
                >
                  <Text tx="profileScreen.cancel" />
                </Button>
                {TimesheetStore.result == null ? (
                  <>
                    {allowCheckin["pass"] && networkInfo['pass'] && allowPicture && address["pass"] ? (
                      <PressableCT
                        onPress={async () => {
                          await onCheckin()
                          onExit(false)
                        }}
                        w={[24, 48, 72]}
                        tx="homeScreen.checkin"
                      />
                    ) : (
                      <ButtonDisabled
                        tx="homeScreen.checkin"
                        w={[24, 48, 72]}
                        onPress={() => console.log("Button Check result: ", {time: allowCheckin["pass"] ,network: networkInfo['pass'], allowPicture, address: address["pass"] })}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {allowCheckin["pass"] && networkInfo['pass'] && allowPicture && address["pass"] ? (
                      <PressableCT
                        onPress={async () => {
                          await onCheckin()
                          onExit(false)
                        }}
                        w={[24, 48, 72]}
                        tx="homeScreen.checkout"
                      />
                    ) : (
                      <ButtonDisabled
                        tx="homeScreen.checkin"
                        w={[24, 48, 72]}
                        onPress={() => console.log("Button Check DISABLE: ",{time: allowCheckin["pass"] ,network: networkInfo, allowPicture, address: address["pass"] })}
                      />
                    )}
                  </>
                )}
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
    </View>
  )
})
