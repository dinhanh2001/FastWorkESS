import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { DatePicker, FormInfoShift, Header, Pressable, Screen, Spinner, Text, ToastMessage } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { HStack, Icon, VStack, Pressable as PressNTB, Box, PresenceTransition, useToast, Modal, Radio } from "native-base"
import { dateYMD, formatHHMMTimestamp, getHoursMinutesTimeStamp } from "../../utils/common"
import { MaterialIcons, Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import moment from "moment"


const ROOT: ViewStyle = {
  flex: 1,
}

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `shiftChange: undefined` to HomeStackParamsList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="shiftChange" component={ShiftChangeScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const ShiftChangeScreen: FC<StackScreenProps<HomeStackParamsList, "shiftChange">> = observer(function ShiftChangeScreen({ navigation }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [hideAddShift, setHideAddShift] = useState(false)
  const [peopleApprover, setPeopleApprover] = useState(10)
  const toast = useToast()
  const [arrgetShift, setArrgetShift] = useState([])
  const [pickDate, setPickDate] = useState<number>(parseInt(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x'))) // ngay chon dat dau
  const [pickDateOther, setPickDateOther] = useState<number>(parseInt(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x'))) // ngay chon nguoi muon doi
  const [recipients, setRecipients] = useState([])
  const [approver, setApprover] = useState({})
  const [arrShiftV2, setArrShiftv2] = useState([])
  const { categoriesStore, leaveStore, absenceStore, userStore } = useStores()
  const [primary, setPrimary] = useState('primary')
  const [emailOther, setEmailOther] = useState("//")//email nguoi muon doi
  const [arrPeopleOther, setArrPeopleOther] = useState([]) // mang ca duoc phan cua nguoi muon doi
  const [arrOther, setArrOther] = useState([]) // mang org group
  const [recipientApi, setRecipientApi] = useState([]) // mang nguoi thong bao
  const [approvers, setApprovers] = useState([]) // mang nguoi duyet
  const [shiftcurrent, setShiftcurrent] = useState<object>({}) // ca tang
  const [shiftchange, setShiftchange] = useState({}) // ca can doi
  const [shift_other, setShift_other] = useState({}) // ca muon lam
  const [members, setMembers] = useState<object>({})
  const [describe, setDescribe] = useState<string>('')
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
    const loadData = async () => {
      const shift = categoriesStore.getShift // lay ca 
      const recipients = categoriesStore.Recipients // nguoi thong bao
      const Recipients = await recipients()
      const Shift = await shift()
      if (Recipients || Shift) {
        setRecipients(Recipients['members'])
        setArrgetShift(Shift)
        setArrOther(Recipients['members'])
      }
    }
    loadData()
  }, [])
  useEffect(() => {
    async function setLoop() {
      const approver = categoriesStore.Approver
      const Approver = await approver("shiftchange")
      setApprover({ type: Approver[0]['type'], appro: absenceStore.filter(Approver, peopleApprover, Approver[0]['type']) })
      if (Approver[0]['type'] == "level") {
        setApprovers(absenceStore.filter(Approver, peopleApprover, Approver[0]['type']))
      }
    }
    setLoop()
  }, [peopleApprover])
  useEffect(() => {
    async function setLoop() {
      const shiftV2 = categoriesStore.ShiftV2
      const ShiftV2 = await shiftV2(pickDate, pickDate, userStore.email)
      let day = moment(pickDate).format("D")
      if (ShiftV2[0]['data'][`${day}`]['shift'][0]) {
        setArrShiftv2(ShiftV2[0]['data'][`${day}`]['shift'])
      }
      else {
        setArrShiftv2([])
      }
    }
    setLoop()
  }, [pickDate])
  useEffect(() => {
    async function loadOther() {
      const shiftV2Other = categoriesStore.ShiftV2
      const ShiftV2Other = await shiftV2Other(pickDateOther, pickDateOther, emailOther)
      let day = moment(pickDateOther).format("D")
      if (ShiftV2Other.length > 0) {
        console.log("shift v2 [0]", ShiftV2Other[0])
        if (typeof ShiftV2Other[0]['data'][day]['shift'] == "string") {
          setArrPeopleOther([])
        }
        else {
          setArrPeopleOther(ShiftV2Other[0]['data'][`${day}`]['shift'])
        }
      }
      else {
        setArrPeopleOther([])
      }
    }
    loadOther()
  }, [emailOther, pickDateOther])

  const OnConfirm = async () => {
    if(approvers.length <1) {
      toast.show({
        placement:"top",
        render:()=>{
          return (
            <ToastMessage text="Chưa chọn người duyệt" type="warning" />
          )
        }
      })
    }
    else if(typeof shift_other['bat_dau'] == "undefined") {
      toast.show({
        placement:"top",
        render:()=>{
          return (
            <ToastMessage text="Chưa chọn ca muốn làm" type="warning" />
          )
        }
      })
    }
    else {

    }
  }
  return (
    <>
      <Screen style={ROOT} preset="scroll">
        <Header leftIcon={true} headerTx="shiftChangeRequest.shiftChangeHeader" border={true} titleStyle={{ color: color.storybookDarkBg }}
          onLeftPress={() => { navigation.goBack() }} />
        <ScrollView >
          <Box p="1" w="100%">

            <VStack mx="1">

              <PressNTB onPress={() => setIsOpen(!isOpen)}>
                <HStack justifyContent={"space-between"} bg={color.backGroundView} p="2" mb="2" alignItems={"center"}>
                  <HStack alignItems={"center"}>
                    <Text tx="absenceRequestScreen.infoRequest" fontWeight={"bold"} fontSize={spacing[4]} opacity={0.7} mr="2" />
                    <Ionicons name="add-circle-sharp" size={28} color={color.primaryend} onPress={() => { setModalVisible(true) }} style={{ zIndex: 1000 }} />
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
                  {hideAddShift ?
                    <PressNTB onPress={() => { setModalVisible(true) }}>
                      <VStack borderBottomColor={"#ccc"} p="2" borderBottomWidth={0.5} zIndex={100} bg={color.background} >
                        <HStack alignItems={"center"} justifyContent="space-between" borderBottomColor={color.backGroundView} borderBottomWidth={0.5} pb="2">
                          <HStack>
                            <FontAwesome5 name="calendar-alt" size={20} color={color.buttend} />
                            <Text ml="1" fontSize={16} text={`${dateYMD(pickDate)}`} fontWeight={"700"} color={color.buttend} />
                          </HStack>
                          <Icon as={<MaterialIcons name="delete" />} color={color.danger} size="xl" onPress={() => { setHideAddShift(false) }} />
                        </HStack>
                        <HStack alignItems={"center"} justifyContent={"space-between"} mt="1">
                          <HStack alignItems={'center'}>
                            <MaterialIcons name="style" size={20} color={color.buttend} />
                            <Text ml="1" fontWeight={"500"} text="Kiểu đổi ca:" opacity={0.8} />
                          </HStack>
                          {primary=="primary" ?  <Text tx="shiftChangeRequest.primamy" fontWeight={"bold"} /> :  <Text tx="shiftChangeRequest.other" fontWeight={"bold"} />}
                        </HStack>
                        <HStack justifyContent={"space-between"} mt="1">
                          <HStack alignItems={'center'}>
                            <FontAwesome name="exchange" size={20} color={color.buttend} />
                            <Text ml="1" fontWeight={"500"} text="Ca cần đổi:" opacity={0.8} />
                          </HStack>
                          <Text text={`${shiftchange['ten_ca']}`} fontWeight={"bold"} />
                        </HStack>
                        <HStack justifyContent={"space-between"}>
                          <HStack   >
                            <MaterialIcons name="settings-system-daydream" size={20} color={color.buttend} />
                            <Text ml="1" text="Ca muốn làm:" />
                          </HStack>
                          <Text text={`${shift_other['ten_ca']}`} fontWeight={"bold"} />
                        </HStack>
                        {/* <HStack mb="1" justifyContent={"space-between"} mt="1">
                         <HStack alignItems={'center'}>
                           <Feather name="arrow-right-circle" size={20} color={color.buttend} />
                           <Text ml="1" text="Lí do:" opacity={0.8} />
                         </HStack>
                         <Text fontWeight={"bold"} text={`${reason['name']}`} />
                       </HStack> */}
                      </VStack>
                    </PressNTB>

                    : null}
                </VStack>
              </PresenceTransition>
            </VStack>
            <FormInfoShift loopfilter={approver['appro']} type={approver['type']} recipients={recipients} onPassingApprovers={SetarrApprover} onPassingRecipient={SetRecipient} desc={setDesc} />
            {leaveStore.status === "pending" ? <Spinner tx="loginScreen.loading" color={"white"} bg="tertiary.500" /> : <Pressable tx="absenceRequestScreen.sentform" onPress={OnConfirm} />}
            {/* <FormInfoShift  loopfilter={} recipients={} /> */}
          </Box>
        </ScrollView>
      </Screen>
      <Modal isOpen={modalVisible} onClose={setModalVisible} backdropVisible={false} size="full"  >
        <Modal.Content >
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
                  <Text tx="shiftChangeRequest.shiftChangeMode" fontWeight={"bold"} fontSize={spacing[5]} />
                  <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
                </HStack>
                <VStack px="2">
                  <Radio.Group name="ChangeShift" colorScheme="green" accessibilityLabel="Ca chon" onChange={nextValue => {
                    setPrimary(nextValue)
                  }} >
                    <Radio value={`primary`} my={1}  >
                      <Text tx="shiftChangeRequest.primamy" />
                    </Radio>
                    <Radio value={`other`} my={1}  >
                      <Text tx="shiftChangeRequest.other" />
                    </Radio>
                  </Radio.Group>
                </VStack>
                <HStack bg={color.backGroundView} p="2" >
                  <Text tx="shiftChangeRequest.DatetoChange" fontWeight={"bold"} fontSize={spacing[5]} />
                  <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
                </HStack>
                <VStack p="2">
                  <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())}
                    borderWidth="0" borderColor="transparent" onPassing={(e) => {
                      setPickDate(parseInt(moment(e).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x')))//set({hour:12,minute:0,second:0,millisecond:0}).format('x')
                    }} />
                </VStack>
              </VStack>
              <HStack bg={color.backGroundView} p="2" mb="1">
                <Text tx="shiftChangeRequest.ShiftNeedtoChange" fontWeight={"bold"} fontSize={spacing[5]} />
                <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
              </HStack>
              <VStack p="2">
                <Radio.Group name="shiftv2" colorScheme="green" accessibilityLabel="Ca can doi" onChange={nextValue => {
                  setShiftchange(arrShiftV2[`${nextValue}`])
                }} >
                  {
                    arrShiftV2.length > 0 ?
                      arrShiftV2.map((value, index) => {
                        return (
                          <Radio value={`${index}`} my={1} key={index} >
                            <Text text={`${value['ten_ca']} ( ${formatHHMMTimestamp(value['bat_dau'])} - ${formatHHMMTimestamp(value['ket_thuc'])} )`} />
                          </Radio>
                        )
                      }) : <Text tx="shared.notAssigned" />}
                </Radio.Group>
              </VStack>
              {primary == "primary" ?
                <>
                  <HStack bg={color.backGroundView} p="2" mb="1">
                    <Text tx="shiftChangeRequest.ShiftChange" fontWeight="bold" fontSize={spacing[5]} />
                    <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
                  </HStack>
                  <VStack px="2">
                    <Radio.Group name="myRadioGroup" colorScheme="green" accessibilityLabel="Ca muon lam" onChange={nextValue => {
                      setShift_other(arrgetShift[`${nextValue}`])
                    }}>
                      {arrgetShift.map((value, index) => {
                        return (
                          <Radio value={`${index}`} my={1} key={index} >
                            <Text text={`${value['ten_ca']}`} />
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                  </VStack>
                </>
                :
                <>
                  <HStack bg={color.backGroundView} p="2" >
                    <Text tx="shiftChangeRequest.peopleChange" fontWeight={"bold"} fontSize={spacing[5]} />
                    <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
                  </HStack>
                  <VStack p="2" >
                    <Radio.Group name="shiftv2" colorScheme="green" accessibilityLabel="ca other" onChange={nextValue => {
                      setMembers({email:arrOther[`${nextValue}`]['email'],name:arrOther[`${nextValue}`]['name']})
                      setEmailOther(arrOther[`${nextValue}`]['email'])
                    }} >
                      {arrOther.length > 0 ? arrOther.map((value, index) => {
                        return (
                          <Radio value={`${index}`} my={1} key={index}>
                            <Text text={`${value['name']}`} />
                          </Radio>
                        )
                      })

                        : null}
                    </Radio.Group>
                  </VStack>
                  <HStack bg={color.backGroundView} p="2" >
                    <Text tx="shiftChangeRequest.dateChange" fontWeight={"bold"} fontSize={spacing[5]} />
                    <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
                  </HStack>
                  <VStack p="2">
                    <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())}
                      borderWidth="0" borderColor="transparent" onPassing={(e) => {
                        setPickDateOther(parseInt(moment(e).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x'))) //set({hour:12,minute:0,second:0,millisecond:0}).format('x')
                      }} />
                  </VStack>
                  <HStack bg={color.backGroundView} p="2" mb="1">
                    <Text tx="shiftChangeRequest.ShiftChange" fontWeight={"bold"} fontSize={spacing[5]} />
                    <Text text=" *" fontWeight={"bold"} fontSize={spacing[5]} color={color.danger} />
                  </HStack>
                  <VStack p="2" >
                    <Radio.Group name="shiftv2" colorScheme="green" accessibilityLabel="nguoi doi ca" onChange={nextValue => {
                      setShift_other(arrPeopleOther[`${nextValue}`])
                    }} >
                      {
                        arrPeopleOther.length > 0 ?
                          arrPeopleOther.map((value, index) => {
                            return (
                              <Radio value={`${index}`} my={1} key={index}>
                                <Text text={`${value['ten_ca']}`} />
                              </Radio>
                            )
                          }) : <Text tx="shared.notAssigned" />}
                    </Radio.Group>
                  </VStack>
                </>
              }
            </VStack>
          </Modal.Body>
          <Modal.Footer >
            <VStack w={"100%"} >
              <Pressable tx="absenceRequestScreen.confirm" onPress={() => {
                setModalVisible(false)
                setHideAddShift(true)
                setIsOpen(true)
              }} width={"100%"} />
            </VStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
})
