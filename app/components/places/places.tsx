import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { useState, useEffect } from "react"
import {
  ScrollView,
  useToast,
  VStack,
  HStack,
  Actionsheet,
  Box,
  Pressable,
  Spacer,
} from "native-base"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { useStores } from "../../models"
import { getCurrentPosition } from "../../utils/gps"
import * as checkinConfig from "../../utils/checkin"
// import { useNetInfo } from "@react-native-community/netinfo"
import NetInfo from "@react-native-community/netinfo"
import { ToastMessage } from "../toast-message/toast-message"
// import { SelectOptions } from "../select-options/select-options"
import { SkeletonItemlist } from "../skeleton-itemlist/skeleton-itemlist"
import { EvilIcons } from "@expo/vector-icons"
import { dateSetHoursMinutes } from "../../utils/common"
import { ModalCheckin } from "../modal-checkin/modal-checkin"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface PlacesProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  onShow?(e: boolean): void
}

/**
 * Describe your component here
 */
export const Places = observer(function Places(props: PlacesProps) {
  const { style, onShow } = props
  const styles = Object.assign({}, CONTAINER, style)
  const { PlaceStore, locationStore, TimesheetStore } = useStores()
  const [skeleton, setSkeleton] = useState<boolean>(true)
  const [showModal, setShowModal] = useState(false)
  // const [ lastActivities, setLastActivities ] = useState(null)
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [place, setPlace] = useState<object>({})
  // const { isConnected } = useNetInfo()
  const [position, setPosition] = useState<object>({})
  const [ arrayFormat, setArrayFormat ] = useState<Array<object>>()

  const onClose = (e) => {
    setShowModal(e)
    onShow(e)
  }

  const formatArray = (array) => {
    let shiftSelect = []
    array.map((d: object) => {
      const item = {
        value: d,
        name: `${d["ten"]} (${dateSetHoursMinutes(d["bat_dau"])} - ${dateSetHoursMinutes(
          d["ket_thuc"],
        )})`,
      }
      shiftSelect.push(item)
    })
    setArrayFormat(shiftSelect)
    return shiftSelect
  }
  const places = PlaceStore.places
  // const netInfo = useNetInfo()
  const toast = useToast()
  
  useEffect(() => {
    console.log("TimesheetStore", TimesheetStore)
    NetInfo.addEventListener(async (state) => {
      if (state["isConnected"] == false) {
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
        onShow(false)
      }
    })
    const load = async () => {
      const place = await PlaceStore.getPlaces()
      // const userLocation = await watchPosition()
      // console.log(userLocation)
      const userLocation = await getCurrentPosition()
        .then((position) => {
          console.log("Lấy vị trí thành công!")
          if (position["code"]) {
            onShow(false)
            toast.show({
              placement: "top",
              render: () => {
                return (
                  <ToastMessage
                    tx="shared.error"
                    type={"error"}
                    subText={"Không thể lấy vị trí hiện tại, hãy thử lại!!"}
                  />
                )
              },
            })
          }
          locationStore.saveLocation(position)
          setPosition(position)
        })
        .catch((err) => {
          console.log("Không thể lấy vị trí hiện tại", err)
          onShow(false)
          toast.show({
            placement: "top",
            render: () => {
              return (
                <ToastMessage
                  tx="shared.error"
                  type={"error"}
                  subText={"Không thể lấy vị trí hiện tại, hãy thử lại!"}
                />
              )
            },
          })
          // locationStore.saveLocation({})
        })
      setSkeleton(false)
    }
    load()
  }, [])
  return (
    <View style={styles}>
      {isOpen && (
        <Actionsheet
          isOpen={isOpen}
          onClose={() => {
            onShow(false)
          }}
        >
          <Actionsheet.Content>
            <ScrollView style={{ width: "100%" }}>
              {skeleton ? (
                <>
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                  <SkeletonItemlist icons={false} />
                </>
              ) : (
                
                
                TimesheetStore.result != null && TimesheetStore.result['target']['visitOut'] == true ?
                places.map((place, key) => {
                  // const shift = place.shift
                  if(TimesheetStore.result != null && place['id'] == TimesheetStore.result['target']['_id']){
                    return (
                    <Pressable
                      key={key}
                      style={{ width: "100%", marginBottom: 10 }}
                      onPress={async () => {
                        formatArray(place["shift"])
                        setShowModal(true)
                        setPlace(place)
                        setIsOpen(false)
                      }}
                    >
                      <Box
                        borderBottomWidth="1"
                        _dark={{
                          borderColor: "muted.10",
                        }}
                        borderColor="muted.200"
                        pl={["0", "4"]}
                        pr={["0", "5"]}
                        py="2"
                      >
                        <HStack space={[2, 3]} justifyContent="space-between">
                          <VStack>
                            <Text
                              _dark={{
                                color: "warmGray.50",
                              }}
                              color="coolGray.800"
                              bold
                            >
                              {place.text}
                            </Text>
                            <HStack>
                              {place.address ? (
                                <EvilIcons name="location" size={24} color="black" />
                              ) : null}
                              <Text
                                color="coolGray.600"
                                _dark={{
                                  color: "warmGray.200",
                                }}
                              >
                                {place.address}
                              </Text>
                            </HStack>
                          </VStack>
                          <Spacer />
                          <Text
                            fontSize="xs"
                            _dark={{
                              color: "warmGray.50",
                            }}
                            color="coolGray.800"
                            alignSelf="flex-start"
                          >
                            {checkinConfig.distance(Object.assign(position, place)).distance
                              ? `${
                                  checkinConfig.distance(Object.assign(position, place)).distance
                                }${checkinConfig.distance(Object.assign(position, place)).unit}`
                              : null}
                          </Text>
                        </HStack>
                      </Box>
                    </Pressable>
                  )
                  }else {
                    return (null)
                  }
                  
                })
                :
                places.map((place, key) => {
                  // const shift = place.shift
                    return (
                    <Pressable
                      key={key}
                      style={{ width: "100%", marginBottom: 10 }}
                      onPress={async () => {
                        formatArray(place["shift"])
                        setShowModal(true)
                        setPlace(place)
                        setIsOpen(false)
                      }}
                    >
                      <Box
                        borderBottomWidth="1"
                        _dark={{
                          borderColor: "muted.10",
                        }}
                        borderColor="muted.200"
                        pl={["0", "4"]}
                        pr={["0", "5"]}
                        py="2"
                      >
                        <HStack space={[2, 3]} justifyContent="space-between">
                          <VStack>
                            <Text
                              _dark={{
                                color: "warmGray.50",
                              }}
                              color="coolGray.800"
                              bold
                            >
                              {place.text}
                            </Text>
                            <HStack>
                              {place.address ? (
                                <EvilIcons name="location" size={24} color="black" />
                              ) : null}
                              <Text
                                color="coolGray.600"
                                _dark={{
                                  color: "warmGray.200",
                                }}
                              >
                                {place.address}
                              </Text>
                            </HStack>
                          </VStack>
                          <Spacer />
                          <Text
                            fontSize="xs"
                            _dark={{
                              color: "warmGray.50",
                            }}
                            color="coolGray.800"
                            alignSelf="flex-start"
                          >
                            {checkinConfig.distance(Object.assign(position, place)).distance
                              ? `${
                                  checkinConfig.distance(Object.assign(position, place)).distance
                                }${checkinConfig.distance(Object.assign(position, place)).unit}`
                              : null}
                          </Text>
                        </HStack>
                      </Box>
                    </Pressable>
                  )
                })
              ) 
            
            }
            </ScrollView>
          </Actionsheet.Content>
        </Actionsheet>
      )}
      {showModal && (
        <ModalCheckin place={Object.assign(position, place)} ca={place['shift_ca'] ? place['shift_ca'][0] : null} onExit={onClose} choiceShift={arrayFormat}/>
      )}
    </View>
  )
})
