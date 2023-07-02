import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { useState, useEffect } from "react"
import { Modal, Button, ScrollView, useToast, VStack, HStack } from "native-base"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { ItemList } from "../item-list/item-list"
import { useStores } from "../../models"
import { Map } from "../map/map"
import { getCurrentPosition } from "../../utils/gps"
import * as checkinConfig from "../../utils/checkin"
import { useNetInfo } from "@react-native-community/netinfo"
import { ToastMessage } from "../toast-message/toast-message"
// import { SelectOptions } from "../select-options/select-options"
import { SkeletonItemlist } from "../skeleton-itemlist/skeleton-itemlist"
import { MenuSelect } from "../menu-select/menu-select"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface PlacesProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  onShow?(e): void
}

/**
 * Describe your component here
 */
export const Places = observer(function Places(props: PlacesProps) {
  const { style, onShow } = props
  const styles = Object.assign({}, CONTAINER, style)
  const { PlaceStore, TimesheetStore } = useStores()
  const [skeleton, setSkeleton] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [showModal, setShowModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  // const [ lastActivities, setLastActivities ] = useState(null)
  // const { isConnected } = useNetInfo()
  const [position, setPosition] = useState<object>()
  const [address, setAddress] = useState<object>()
  const [networkInfo, setNetworkInfo] = useState<object>()
  const [shiftSelected, setShiftSelected] = useState(null)
  const getPlace = async () => {
    if (!netInfo.isConnected && netInfo.isConnected != null) {
      toast.show({
        placement: "top",
        render: () => {
          return (
            <ToastMessage
              tx="shared.error"
              type={"error"}
              subText={"No internet connection, please try again!"}
            />
          )
        },
      })
    }
    await PlaceStore.getPlaces()
    setSkeleton(false)
  }
  const onChangeSelect = async (e) => {
    console.log(e)
    setShiftSelected(e)
  }
  const formatArray = (array) => {
    let shiftSelect = []
    array.map((d) => {
      const item = { value: d, name: d["ten"] }
      shiftSelect.push(item)
    })
    return shiftSelect
  }
  const places = PlaceStore.places
  const netInfo = useNetInfo()
  const toast = useToast()

  const verifyCheckin = async (ca: object, place: object) => {
    if (!netInfo.isConnected) {
      toast.show({
        placement: "top",
        render: () => {
          return (
            <ToastMessage
              tx="shared.error"
              type={"error"}
              subText={"No internet connection, please try again!"}
            />
          )
        },
      })
    }
    // const data: object = checkinConfig.dataPost(ca, place)
    const allowCheckin = checkinConfig.allowCheckin(ca)
    const verifyNetwork = checkinConfig.network(place)
    const distance = checkinConfig.distance(place)
    if(allowCheckin == true){
      if(distance == true){
        setAddress(null)
        if(verifyNetwork == true){
          await openCamera(ca,place)
        }else{
          setShowNetworkModal(true)
          setNetworkInfo(verifyNetwork)
        }
      }else{
        setAddress(Object.assign(distance,place))
        setShowMapModal(true)
      }
    }else{
      setIsOpen(true)
    }
  }

  const checkNetWork = async (ca: object,place: object) => {
    const network = checkinConfig.network(place)
    console.log("network", network)
    if(network == true){
      await openCamera(ca,place)
    }
  }
  const openCamera = async (ca: object, place: object) => {
    const picture = await checkinConfig.picture(place)
    const dataPost = checkinConfig.dataPost(ca, place)
    if(picture['picture'] != null && typeof picture['picture'] == 'string'){
      const result = await TimesheetStore.faceVerify(picture['picture'])
      console.log(result['result']['imagename'])
      if(result['result']){
        console.log("dataPost", dataPost)
        dataPost['photo'] = result['result']['imagename']
        const checkin = await TimesheetStore.checkin(dataPost)
        console.log(checkin)
        onShow(false)
      }
    }else{
      const checkin = await TimesheetStore.checkin(dataPost)
      console.log(checkin)
      onShow(false)
    }
  }
  useEffect(() => {
    const load = async () => {
      getPlace()
      // getLastActivities()
      const position = await getCurrentPosition()
      if (position["code"]) {
        setIsOpen(false)
        toast.show({
          placement: "top",
          render: () => {
            return (
              <ToastMessage
                tx="shared.error"
                type={"error"}
                subText={"Can't get current Position, please try again!"}
              />
            )
          },
        })
      }
      setPosition(position)
    }
    load()
  }, [])
  return (
    <View style={styles}>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => onShow(false)} size="full">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            <Text tx="homeScreen.checkin" />
          </Modal.Header>
          <Modal.Body>
            <ScrollView>
              {skeleton ? (
                <>
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                </>
              ) : (
                places.map((place, key) => {
                  // const shift = place.shift
                  return (
                    <VStack key={key}>
                      <ItemList
                        mainText={place["text"]}
                        text={
                          shiftSelected
                            ? shiftSelected["ten"]
                            : place.shift_ca[0]
                              ? place.shift_ca[0].ten
                              : "Chưa được phân ca"
                        }
                      />
                      <HStack>
                        {place.choiceShift && (
                          <MenuSelect
                            arrValue={formatArray(place["shift"])}
                            title={"checkinScreen.chooseShift"}
                            type="radio"
                            onChange={onChangeSelect}
                            defaultValue={
                              shiftSelected
                                ? shiftSelected["ma"]
                                : place.shift_ca[0]
                                  ? place.shift_ca[0].ma
                                  : null
                            }
                          />
                        )}
                        <Button
                          style={{ width: 100, marginLeft: 5 }}
                          onPress={async () => {
                            if (!shiftSelected && !place.shift_ca[0]) {
                              setShowModal(true)
                            } else {
                              await verifyCheckin(
                                shiftSelected
                                  ? shiftSelected
                                  : place.shift_ca[0]
                                    ? place.shift_ca[0]
                                    : null,
                                Object.assign(
                                  position, place),
                              )
                            }
                          }}
                        >
                          <Text tx="homeScreen.attendance" />
                        </Button>
                      </HStack>
                    </VStack>
                  )
                })
              )}
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  onShow(false)
                }}
              >
                <Text tx="profileScreen.cancel" />
              </Button>
              <Button
                onPress={() => {
                  onShow(false)
                }}
              >
                <Text style={{ color: "white" }} tx="profileScreen.save" />
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        _backdrop={{
          _dark: {
            bg: "coolGray.800",
          },
          bg: "warmGray.50",
        }}
      >
        <Modal.Content maxWidth="350" maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Chọn ca</Modal.Header>
          <Modal.Body>
            <Text text={"Bạn chưa được phân ca, xin hãy chọn ca làm việc!"} />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* // Map Modal */}
      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        _backdrop={{
          _dark: {
            bg: "coolGray.800",
          },
          bg: "warmGray.50",
        }}
      >
        <Modal.Content size={"full"}>
          <Modal.CloseButton />
          <Modal.Header>Distance</Modal.Header>
          <Modal.Body>
            <Map style={{ width: "100%", height: 500 }} position={address} />
            {address && (<Text text={`Bạn đang ở cách vị trí chấm công ${address['distance']} mét, Bạn có chắc muốn thực hiện chấm công vào tại đây`}/>)}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowMapModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={async () => {
                  setShowMapModal(false)
                  await checkNetWork(address,
                    address)
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Network Modal */}
      <Modal
        isOpen={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        _backdrop={{
          _dark: {
            bg: "coolGray.800",
          },
          bg: "warmGray.50",
        }}
      >
        <Modal.Content size={"full"}>
          <Modal.CloseButton />
          <Modal.Header>Distance</Modal.Header>
          <Modal.Body>
            {networkInfo && <Text style={{fontWeight: "bold"}} text={`Địa chỉ ${networkInfo['type']} không đúng`}/>}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowNetworkModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={async () => {
                  setShowNetworkModal(false)
                  await checkinConfig.picture(address)
                  await openCamera(address,
                    address)
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {/*  */}
    </View>
  )
})
