import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { DatePicker, FormInfoShift, Header, Pressable, Screen, Spinner, Text, TextField, ToastMessage } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { MaterialIcons, Ionicons, FontAwesome5, AntDesign } from '@expo/vector-icons';

import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { Box, HStack, PresenceTransition, useToast, VStack, Pressable as PressNTB, Icon, Modal, Radio } from "native-base"
import moment from "moment"
import {  testDateToDate ,dateDMY ,formatHHMMTimestamp ,dateYMD ,getHoursMinutesTimeStamp} from "../../utils/common"

const ROOT: ViewStyle = {
  flex: 1,
}

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `workTime: undefined` to NavigatorParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="workTime" component={WorkTimeScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const WorkTimeScreen: FC<StackScreenProps<HomeStackParamsList, "worktime">> = observer(function WorkTimeScreen({ navigation }) {
  // Pull in one of our MST stores
  const [isOpen, setIsOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [openmodal, setOpenmodal] = useState(false)
  const [peopleApprover, setPeopleApprover] = useState(0)
  const toast = useToast()
  const [pickDateStart, setPickDateStart] = useState<number>(parseInt(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x'))) // ngay chon dat dau
  const [pickDateEnd, setPickDateEnd] = useState<number>(parseInt(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x'))) // ngay chon ket thuc
  const [hhmmStart, setHHMMStart] = useState(28800000)//)
  const [hhmmEnd, setHHMMEnd] = useState(61200000)
  const [arrTemporary, setTemporary] = useState([])
  const [recipients, setRecipients] = useState([])
  const [approver, setApprover] = useState([])
  const [reasonWorktime, setReasonWorktime] = useState([])
  const [idChange, setIdChange] = useState(null)
  const { categoriesStore, leaveStore,worktimeStore, absenceStore } = useStores()
  const [arrMisson, setArrMisson] = useState([]) // mang don cong tac
  const [recipientApi, setRecipientApi] = useState([]) // mang nguoi thong bao
  const [approvers, setApprovers] = useState([]) // mang nguoi duyet
  const [shiftcurrent, setShiftcurrent] = useState<object>({}) // ca cong tac
  const [describe, setDescribe] = useState<string>('') // mo ta
  const [reason, setReason] = useState({})// li do xin che do
  const SetRecipient = (data) => {
    setRecipientApi(data)
  }
  const SetarrApprover = (data) => {
    setApprovers(data)
  }
  const setDesc = (data) => {
    setDescribe(data)
  }
  useEffect(() => {
    const getData = async () => {
      const recipients = categoriesStore.Recipients
      const worktime = categoriesStore.categoriesleave
      const Recipients = await recipients()
      const Worktime = await worktime('worktime')
      if (Recipients || Worktime) {
        setRecipients(Recipients['recipients'])
        setReasonWorktime(Worktime)
      }

    }
    getData()
  }, [])
  useEffect(() => {
    async function setLoop() {
      const approver = categoriesStore.Approver
      const Approver = await approver("worktime")
      setApprover(absenceStore.filter(Approver, peopleApprover))
    }
    setLoop()
  }, [peopleApprover])
  const deleteShift = (value) => {
    // let arr = arrTemporary.splice(value,1)
    // let arrApi = arrMisson.splice(value,1)
    // arrApi.splice(value,1)
    // arr.splice(value, 1) filter value !== index
    // arrTemporary.splice(value,1)
    // arrMisson.splice(value,1)
    // setTemporary(arrTemporary)
    // setArrMisson(arrMisson)
    let arr = []
    let arrApi = []
    arrTemporary.map((item, index) => {
      value != index ? arr.push(item) : null
    })
    arrMisson.map((item, index) => {
      value != index ? arrApi.push(item) : null
    })
    setArrMisson(arrApi)
    setTemporary(arr)
    setRefresh(!refresh)

  }
  const setWorktime = async () => {
    if (!testDateToDate(pickDateStart, pickDateEnd)) {

      setModalVisible(false)
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage text="Ngày bắt đầu chế độ phải nhỏ hơn ngày kết thúc " type="warning" />
        }
      })
    }
    else if (typeof reason['name'] == 'undefined') {
      setModalVisible(false)
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage text="Chưa chọn lí do" type="warning" />
        }
      })
    }
    else {
      // const getRender = missonStore.renderListDay
      setIsOpen(true)
      setModalVisible(false)
      // const result = await getRender(pickDateStart, pickDateEnd, hhmmStart, hhmmEnd, shiftcurrent)
      // const resultTemporary = await getRender(pickDateStart, pickDateEnd, hhmmStart, hhmmEnd, shiftcurrent)
      // setTemporary(resultTemporary)
      // setArrMisson(result)
    }
  }
  const OnConfirm = async () => {
    if (approvers.length == 0) {
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage text="Chưa chọn người duyệt " type="warning" />
        }
      })
    }
    else {
      worktimeStore.setDataWorktime(pickDateStart,pickDateEnd,hhmmStart,hhmmEnd,recipientApi,describe,approvers,reason)
       const sentFormMisson = worktimeStore.createWorktime
       const SentForm = await sentFormMisson()
       if(SentForm.active){
        toast.show({
          placement:"top",
          render :()=>{
            return <ToastMessage tx="shared.createSuccess" type="success" />
          }
        })
      navigation.navigate("searchrequest",{type:"worktime",status:"Chờ duyệt"})
      }
      else {
        toast.show({
          placement:"top",
          render :()=>{
            return <ToastMessage text={SentForm.result} type="warning" />
          }
        })
      }

    }
  }
  return (
    <Screen style={ROOT} preset="scroll">
      <Header leftIcon={true} headerText="Xin chế độ" border={true} titleStyle={{ color: color.storybookDarkBg }}
        onLeftPress={() => { navigation.goBack() }} />
      <ScrollView>
        <Box p="1" w="100%">

          <VStack mx="1">

            <PressNTB onPress={() => setIsOpen(!isOpen)}>
              <HStack justifyContent={"space-between"} bg={color.backGroundView} p="2" mb="2" alignItems={"center"}>
                <HStack alignItems={"center"}>
                  <Text tx="absenceRequestScreen.infoRequest" fontWeight={"bold"} fontSize={spacing[4]} opacity={0.7} mr="2" />
                  <Ionicons name="add-circle-sharp" size={28} color={color.primaryend} onPress={() => { setModalVisible(true) }} style={{zIndex:1000}} />
                </HStack>
                {isOpen ? <MaterialIcons name="keyboard-arrow-down" size={20} color={color.primaryend} style={{ opacity: 0.7 }} /> : <MaterialIcons name="keyboard-arrow-right" size={20} color={color.primaryend} style={{ opacity: 0.7 }} />}
              </HStack>
            </PressNTB>
            <PresenceTransition visible={isOpen} initial={{
              opacity: 0,
            }} animate={{
              opacity: 1,
              transition: {
                duration: 100
              }
            }}>
              <VStack display={isOpen ? "flex" : "none"} rounded="md" w="100%" >
                {typeof reason['name'] == "undefined" ? null :
                  <Box  >
                    <PressNTB onPress={()=>{setModalVisible(true)}} >
                      <VStack borderBottomColor={"#ccc"} p="2" borderBottomWidth={0.5} zIndex={100} bg={color.background} >
                        <HStack alignItems={"center"} justifyContent="space-between" pb="2">
                          <HStack>
                            <FontAwesome5 name="calendar-alt" size={20} color={color.buttend} />
                            <Text ml="1" fontSize={16} text={"Từ ngày :"} />
                          </HStack>
                          <Text ml="1" fontSize={16} text={`${dateDMY(pickDateStart)}`} fontWeight={"700"} />
                        </HStack>
                        <HStack alignItems={"center"} justifyContent="space-between" pb="2">
                          <HStack>
                            <FontAwesome5 name="calendar-alt" size={20} color={color.buttend} />
                            <Text ml="1" fontSize={16} text={"Đến ngày :"} />
                          </HStack>
                          <Text ml="1" fontSize={16} text={`${dateDMY(pickDateEnd)}`} fontWeight={"700"} />
                        </HStack>
                        <HStack alignItems={"center"} justifyContent={"space-between"}   >
                          <HStack alignItems={'center'}>
                            <AntDesign name="pushpin" size={18} color={color.buttend} />
                            <Text text="Lí do :" fontWeight={"500"} ml="1" />
                          </HStack>
                          <Text text={`${reason['name']}`} fontSize={16} fontWeight={"700"} />
                        </HStack>
                        <HStack alignItems={"center"} justifyContent={"space-between"} mt="1">
                          <HStack alignItems={'center'}>
                            <AntDesign name="clockcircle" size={18} color={color.buttend} />
                            <Text ml="1" fontWeight={"500"} text="Bắt đầu:" opacity={0.8} />
                          </HStack>
                          <Text text={`${formatHHMMTimestamp(hhmmStart)}`} fontWeight={"bold"} />
                        </HStack>
                        <HStack alignItems={"center"} justifyContent={"space-between"} mt="1">
                          <HStack alignItems={'center'}>
                            <AntDesign name="clockcircle" size={18} color={color.buttend} />
                            <Text ml="1" fontWeight={"500"} text="Kết thúc:" opacity={0.8} />
                          </HStack>
                          <Text text={`${formatHHMMTimestamp(hhmmEnd)}`} fontWeight={"bold"} />
                        </HStack>
                        <HStack alignItems={"center"} justifyContent={"space-between"} mt="1" >
                        </HStack>
                      </VStack>
                    </PressNTB>
                  </Box>
                }
              </VStack>
            </PresenceTransition>
          </VStack>

          <FormInfoShift inputDesc={false} loopfilter={approver} recipients={recipients} onPassingApprovers={(data) => { SetarrApprover(data) }} onPassingRecipient={(data) => { SetRecipient(data) }} desc={(data) => { setDesc(data) }} />
          {leaveStore.status === "pending" ? <Spinner tx="loginScreen.loading" color={"white"} bg="tertiary.500" /> : <Pressable tx="absenceRequestScreen.sentform" onPress={OnConfirm} />}
          {/* <FormInfoShift  loopfilter={} recipients={} /> */}
        </Box>
      </ScrollView>
      <Modal isOpen={modalVisible} onClose={setModalVisible} size={"full"} backdropVisible={false} >
        <Modal.Content h="100%" >
          <Modal.CloseButton onPress={() => {
            setModalVisible(false)
          }} />
          <Modal.Header >
            <Text tx="absenceRequestScreen.addRequest" fontWeight={"bold"} fontSize={spacing[5]} />
          </Modal.Header>
          <Modal.Body p="0" mt="1">
            <VStack>
              <VStack w="100%" p="0" >

                <HStack bg={color.backGroundView} p="2" >
                  <Text tx="missonRequest.dateStart" fontWeight={"bold"} fontSize={spacing[5]} />
                  <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
                </HStack>
                <VStack p="2">
                  <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())}
                    borderWidth="0" borderColor="transparent" onPassing={(e) => {
                      setPickDateStart(parseInt(moment(e).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x')))//set({hour:12,minute:0,second:0,millisecond:0}).format('x')
                    }} />
                </VStack>
              </VStack>
              <VStack w="100%" p="0" >

                <HStack bg={color.backGroundView} p="2" >
                  <Text tx="missonRequest.dateEnd" fontWeight={"bold"} fontSize={spacing[5]} />
                  <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
                </HStack>
                <VStack p="2">
                  <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())}
                    borderWidth="0" borderColor="transparent" onPassing={(e) => {
                      setPickDateEnd(parseInt(moment(e).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x')))
                    }} />
                </VStack>
              </VStack>
              <HStack bg={color.backGroundView} p="2" mb="1">
                <Text text="Đi muộn" fontWeight={"bold"} fontSize={spacing[5]} />
                <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
              </HStack>
              <VStack px="2">
                <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())} mode="time"
                  borderWidth="0" borderColor="transparent" onPassing={(e) => {
                    setHHMMStart(getHoursMinutesTimeStamp(e))
                  }} />
              </VStack>
              <HStack bg={color.backGroundView} p="2" mb="1">
                <Text text="Về sớm " fontWeight={"bold"} fontSize={spacing[5]} />
                <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
              </HStack>
              <VStack px="2">
                <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())} mode="time"
                  borderWidth="0" borderColor="transparent" onPassing={(e) => {
                    setHHMMEnd(getHoursMinutesTimeStamp(e))
                  }} />
              </VStack>

              <HStack bg={color.backGroundView} p="2" >
                <Text text="Lí do làm chế độ" fontWeight={"bold"} fontSize={spacing[5]} />
                <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
              </HStack>
              <VStack px="2">
                <Radio.Group name="myRadioGroup" colorScheme="green" accessibilityLabel="Ca chon" onChange={nextValue => {
                  setReason(reasonWorktime[`${nextValue}`])
                }}>
                  {reasonWorktime.map((value, index) => {
                    return (
                      <Radio value={`${index}`} my={1} key={index} >
                        <Text text={`${value['name']}`} />
                      </Radio>
                    )
                  })}
                </Radio.Group>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer >
            <VStack w={"100%"} >
              <Pressable tx="absenceRequestScreen.confirm" onPress={() => { setWorktime() }} width={"100%"} />
            </VStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Screen>
  )
})
