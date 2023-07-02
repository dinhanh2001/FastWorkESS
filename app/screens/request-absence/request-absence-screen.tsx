import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { Header, Pressable, Screen, Text, Checkbox, DatePicker, TextField, FormInfoShift } from "../../components"
import { color, spacing } from "../../theme"
import { Box, HStack, Icon, Modal, VStack, Radio, PresenceTransition, Pressable as PressNTB, useToast } from "native-base"
import { dateYMD,stringYMD } from "../../utils/common"
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { ModalLoader } from "../../components"
import { useStores } from "../../models"
import moment from "moment";
import { ToastMessage } from "../../components"
export const RequestAbsenceScreen: FC<StackScreenProps<HomeStackParamsList, "absence">> = observer(function RequestAbsenceScreen({ navigation,route }) {
  const { categoriesStore,absenceStore,userStore } = useStores()
  const toast = useToast()
  const [peopleApprover, setPeopleApprover] = useState(0)
  const [skeleton, setSketeton] = useState(false)
  const [arrgetShift, setArrgetShift] = useState([])
  const [arrLydo, setArrLydo] = useState([])
  const [caduocphan, setCaduocPhan] = useState([])
  const [shift, setShift] = useState("")
  // open modal
  const [isOpen, setIsOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // open modal
  const [pickDate, setPickDate] = useState<number>(new Date().getTime())
  const [loopfilter, setLoopfilter] = useState([])
  const [recipients, setRecipients] = useState([])
  // obj absence day len server
  let [arrAbsence, setArrAbsence] = useState([])
  const [shiftcurrent, setShiftcurrent] = useState<object>({})
  const [reason, setReason] = useState<object>({})
  const [hasSalary, setHassalary] = useState<object>({})
  const [recipientApi, setRecipientApi] = useState([]) // mang thong bao
  let [approvers, setApprovers] = useState([]) // mang nguoi duyet 
  const [describle,setDescribe] = useState('') // mo ta
  const SetRecipient = (data) => {
    setRecipientApi(data)
  }
  const SetarrApprover = (data) => {
    setApprovers(data)
  }
  const setDesc = (data) => {
    setDescribe(data)
  }
  let Absence = {
    date_start: pickDate,
    shift_current: shiftcurrent,
    shift_start: shift,
    reason: reason,
    has_salary: hasSalary,
    nghi: 1,
    nghi_phep: 0,
    nghi_khong_phep: 1
  }
  useEffect(() => {
    const getDataModal = async () => {
      setSketeton(true)
      const getShift = categoriesStore.getShift
      const reason = categoriesStore.categoriesleave
      const shiftV2 = categoriesStore.ShiftV2
      const recipients = categoriesStore.Recipients
      const GetShift = await getShift()
      const Reason = await reason("leave")
      const ShiftV2 = await shiftV2(pickDate, pickDate,userStore.email)
      const Recipients = await recipients()
      if (Reason || GetShift || ShiftV2 || Recipients) {
        setArrgetShift(GetShift)
        setCaduocPhan(ShiftV2)
        setArrLydo(Reason)
        setRecipients(Recipients['recipients'])
      }
      setSketeton(false)
    }
    getDataModal()
  }, [])
  useEffect(() => {
    const getCaduocPhan = async () => {
      setSketeton(true)
      let shiftV2 = await categoriesStore.ShiftV2(pickDate, pickDate,userStore.email)
      if (shiftV2) {
        setCaduocPhan(shiftV2)

      }
    }
    getCaduocPhan()
    setSketeton(false)
    return () => {
      setSketeton(null)
      setCaduocPhan(null)
    }
  }, [pickDate])
  useEffect(() => {
    async function setLoop() {
      const approver = categoriesStore.Approver
      const Approver = await approver("absence")
      setLoopfilter(absenceStore.filter(Approver, peopleApprover))
    }
    setLoop()
  }, [peopleApprover])
  const OnConfirm = async () => {
    absenceStore.setShiftAbsence(arrAbsence,approvers,recipientApi)
    let sentFormAbsence = absenceStore.createAbsence
    let SentForm = await sentFormAbsence()
    if(SentForm.active){
      toast.show({
        placement:"top",
        render :()=>{
          return <ToastMessage tx="shared.createSuccess" type="success" />
        }
      })
      navigation.navigate("searchrequest",{type:"absence",status:"Chờ duyệt"})
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
  return (
    <Screen preset="fixed"  statusBar="light-content">
      <Header headerTx="request.absence" border={true}
        onLeftPress={() => { navigation.goBack() }} leftIcon={true} />
      <ScrollView showsVerticalScrollIndicator={false} >
        <Box p="1" w={"100%"}>
          <VStack my="1">
            <HStack w={"100%"} borderRadius={5} p="1" background={"orange.100"} justifyContent="space-evenly">
              <VStack alignItems={"center"}
              >
                <Text tx="absenceRequestScreen.totalspell" color={"orange.500"} fontWeight="bold" />
                <Text text="0" color={"orange.500"} />
              </VStack>
              <VStack alignItems={"center"}
              >
                <Text tx="absenceRequestScreen.daysOff" color={"orange.500"} fontWeight="bold" />
                <Text text="0" color={"orange.500"} />
              </VStack>
              <VStack alignItems={"center"}
              >
                <Text tx="absenceRequestScreen.remaining" color={"orange.500"} fontWeight="bold" />
                <Text text="0" color={"orange.500"} />
              </VStack>
            </HStack>
          </VStack>
            <VStack  >
                <VStack mx="1">
                <PressNTB onPress={() => setIsOpen(!isOpen)}>
                  <HStack justifyContent={"space-between"} bg={color.backGroundView} p="2" mb="2" alignItems={"center"}>
                    <HStack alignItems={"center"}>
                      <Text tx="absenceRequestScreen.infoRequest" fontWeight={"bold"} fontSize={spacing[4]} opacity={0.7} mr="2" />
                      <Ionicons name="add-circle-sharp" size={28} color={color.primaryend} onPress={() => { setModalVisible(true) }} style={{zIndex:1000}}/>
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
                  </VStack>
                </PresenceTransition>
                </VStack>
              <FormInfoShift recipients={recipients} loopfilter={arrgetShift}  inputDesc={true}
               onPassingApprovers={(data)=>{SetarrApprover(data)}}  onPassingRecipient={(data)=>{SetRecipient(data)}} desc={(data)=>{setDesc(data)}}  />
              <Pressable tx="absenceRequestScreen.sentform" onPress={OnConfirm} />
          </VStack>
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
                      <Text tx="attendanceScreen.date" fontWeight={"bold"} fontSize={spacing[5]} />
                      <Text text="*" fontWeight={"bold"} color={color.danger} />
                    </HStack>
                    <VStack p="2">
                      <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())}
                        borderWidth="0" borderColor="transparent" onPassing={(e) => {
                          let format =stringYMD(e)
                          setPickDate(parseInt(moment(format).format('x')))
                        }} />
                    </VStack>
                  </VStack>
                  <VStack bg={color.backGroundView} p="2" >
                    <Text tx="absenceRequestScreen.shiftwork" fontWeight={"bold"} fontSize={spacing[5]} />
                  </VStack>
                  <VStack p="2">
                    <Text tx="absenceRequestScreen.administrative" />
                    {/* <Radio.Group name="caduocphan" colorScheme="green" accessibilityLabel="Ca duoc phan" onChange={nextValue => {
                    }}>
                      {
                        caduocphan ?
                          caduocphan.map((value, index) => {
                            return (
                              <Radio value={`${index}`} my={1} key={index}  >
                                {
                                  typeof value['data'][`${Object.keys(value['data'])[0]}`]['shift'][0] === "undefined" ?
                                 
                                    :
                                    <Text text={value['data'][`${Object.keys(value['data'])[0]}`]['shift'][0]['ten_ca']} />
                                }
                              </Radio>
                              )

                          }) : null
                      }
                    </Radio.Group> */}
                  </VStack>
                  <VStack bg={color.backGroundView} p="2" >
                    <Text tx="absenceRequestScreen.shiftpick" fontWeight={"bold"} fontSize={spacing[5]} />
                  </VStack>
                  <VStack p="2">
                    <Radio.Group name="myRadioGroup" colorScheme="green" accessibilityLabel="Ca chon" onChange={nextValue => {
                      setShiftcurrent(arrgetShift[`${nextValue}`])
                    }}>
                      {arrgetShift.map((value, index) => {
                        if (value['ma_loai'] === "none") {
                          return (
                            <Radio value={`${index}`} my={1} key={index} >
                              <Text tx="absenceRequestScreen.dayoff" />
                            </Radio>)
                        }
                        else {
                          return (
                            <Radio value={`${index}`} my={1} key={index} >
                              <Text text={value['ten_ca']} />
                            </Radio>
                          )
                        }
                      })}
                    </Radio.Group>
                  </VStack>
                  <HStack bg={color.backGroundView} p="2" >
                    <Text tx="absenceRequestScreen.shift" fontWeight={"bold"} fontSize={spacing[5]} />
                    <Text text="*" fontWeight={"bold"} color={color.danger} />
                  </HStack>
                  <VStack p="2">
                    <Radio.Group name="dgdg" colorScheme="green" accessibilityLabel="Ca" onChange={nextValue => {
                      setShift(nextValue)
                    }}>
                      <Radio value="Cả ngày" my={1}  >
                        <Text text="Cả ngày" />
                      </Radio>
                      <Radio value="Nửa ca đầu" my={1}  >
                        <Text text="Nửa ca đầu" />
                      </Radio>
                      <Radio value="Nửa ca sau" my={1}  >
                        <Text text="Nửa ca sau" />
                      </Radio>
                    </Radio.Group>
                  </VStack>
                  <HStack bg={color.backGroundView} p="2" >
                    <Text text="Lí do" fontWeight={"bold"} fontSize={spacing[5]} />
                    <Text text="*" fontWeight={"bold"} color={color.danger} />
                  </HStack>
                  <VStack p="2">
                    <Radio.Group name="myRadidgdgoGroup" colorScheme="green" accessibilityLabel="li do" onChange={nextValue => {
                      setReason(arrLydo[`${nextValue}`])
                      setHassalary(arrLydo[`${nextValue}`]['has_salary'])
                    }}>
                      {arrLydo.map((value, index) => {
                        return (
                          <Radio value={`${index}`} my={1} key={index}>
                            <Text text={value['name']} />
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                  </VStack>
                </VStack>
              </Modal.Body>
              <Modal.Footer >
                <VStack w={"100%"} >
                  <Pressable tx="absenceRequestScreen.confirm" onPress={() => {
                    if (shift === "Cả ngày") {
                      setPeopleApprover(peopleApprover => (peopleApprover + 1))
                    } else {
                      setPeopleApprover(peopleApprover => (peopleApprover + 0.5))
                    }
                    if (!arrAbsence.some(value => value == Absence)) {
                      setArrAbsence([...arrAbsence, Absence])
                    }
                    setModalVisible(false)
                  }} width={"100%"} />
                </VStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
      {skeleton ? <ModalLoader loading={true} /> : null}
    </Screen>
  )
})