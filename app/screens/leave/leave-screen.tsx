import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { Header, Screen, Text, Checkbox, TextField, Pressable, DatePicker, FormInfoShift, ToastMessage, Spinner } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { VStack, Box, HStack, Modal, Pressable as PressNTB, useToast, PresenceTransition, Radio, Icon } from "native-base"
import { MaterialIcons, Ionicons, Feather,FontAwesome5 ,AntDesign} from '@expo/vector-icons';
import moment from "moment";
import { formatHHMMTimestamp, dateYMD, getHoursMinutesTimeStamp } from "../../utils/common"
const ROOT: ViewStyle = {
  flex: 1,
}

//
export const LeaveScreen: FC<StackScreenProps<HomeStackParamsList, "leaverequest">> = observer(function LeaveScreen({ navigation }) {

  const { categoriesStore, leaveStore } = useStores()

  const toast = useToast()
  const [skeleton, setSketeton] = useState(false)
  const [hideAddShift ,setHideAddShift] = useState(false)
  const [arrgetShift, setArrgetShift] = useState([])
  const [arrLydo, setArrLydo] = useState([])
  // open modal
  const [isOpen, setIsOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // open modal
  const [pickDate, setPickDate] = useState<number>(new Date().getTime())
  const [loopfilter, setLoopfilter] = useState([])
  const [recipients, setRecipients] = useState([])
  const [hhmmStart, setHHMMStart] = useState(new Date().getTime() - new Date().setHours(0, 0, 0, 0))
  const [hhmmEnd, setHHMMEnd] = useState(new Date().getTime() - new Date().setHours(0, 0, 0, 0))
  // obj leave day len server
  const [shiftcurrent, setShiftcurrent] = useState<object>({}) // ca chon
  const [reason, setReason] = useState<object>({}) // li do 
  const [recipientApi, setRecipientApi] = useState([]) // mang nguoi thong bao
  let [approvers, setApprovers] = useState([]) // mang nguoi duyet
  const SetRecipient = (data) => {
    setRecipientApi(data)
  }
  const SetarrApprover = (data) => {
    setApprovers(data)
  }
  useEffect(() => {
    async function getData() {
      const arrGetShift = categoriesStore.getShift
      const reason = categoriesStore.categoriesleave
      const recipients = categoriesStore.Recipients
      const approver = categoriesStore.Approver
      const Approver = await approver("later")
      const GetShift = await arrGetShift()
      const Reason = await reason("later")
      const Recipients = await recipients()
      if (GetShift || Reason || Recipients || Approver) {
        setArrgetShift(GetShift)
        setArrLydo(Reason)
        setRecipients(Recipients['recipients'])
        setLoopfilter(Approver)
      }
    }
    getData()
  }, [])
  const OnConfirm = async ()=>{
    if(typeof reason['_id'] == "undefined"){
      toast.show({
        placement:"top",
        render :()=>{
          return <ToastMessage text={"Chưa chọn lí do"} type="warning" />
        }
      })
    }
    else if(approvers.length ==0){
      toast.show({
        duration:500,
        placement:"top",
        render :()=>{
          return <ToastMessage text="Chưa chọn người duyệt" type="warning" />
        }
      })
    }
    else {
      leaveStore.setPropsLeave(reason,pickDate,hhmmStart,hhmmEnd,recipientApi,approvers,shiftcurrent)
      const createLeave = leaveStore.createLeave
      const SentForm = await createLeave()
      if(SentForm.active){
        toast.show({
          duration:500,
          placement:"top",
          render :()=>{
            return <ToastMessage tx="shared.createSuccess" type="success" />
          }
        })
      navigation.navigate("searchrequest",{type:"later",status:"Chờ duyệt"})
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
    <Screen style={ROOT} preset="scroll" statusBar="light-content">
      <Header headerTx="leaveRequest.leaveRequestHeader" border={true}
        onLeftPress={() => { navigation.goBack() }} leftIcon={true} />
      <ScrollView showsVerticalScrollIndicator={false} >
        <Box p="1" w={"100%"}>
          <VStack my="1">
            <HStack w={"100%"} borderRadius={5} p="1" background={"orange.100"} justifyContent="space-evenly">
              <VStack alignItems={"center"}
              >
                <Text tx="leaveRequest.workCalculation" color={"orange.500"} fontWeight="bold" />
                <Text text="Không" color={"orange.500"} />
              </VStack>
              <VStack alignItems={"center"}
              >
                <Text tx="leaveRequest.monetaryfine" color={"orange.500"} fontWeight="bold" />
                <Text text="Không" color={"orange.500"} />
              </VStack>
              <VStack alignItems={"center"}
              >
                <Text tx="leaveRequest.closingRequest" color={"orange.500"} fontWeight="bold" />
                <Text text="Không" color={"orange.500"} />
              </VStack>
            </HStack>
          </VStack>

          <VStack mx="1">

            <PressNTB onPress={() => setIsOpen(!isOpen)}>
              <HStack justifyContent={"space-between"} bg={color.backGroundView} p="2" mb="2" alignItems={"center"}>
                <HStack alignItems={"center"}>
                  <Text tx="absenceRequestScreen.infoRequest" fontWeight={"bold"} fontSize={spacing[4]} opacity={0.7} mr="2" />
                  {hideAddShift ? null : <Ionicons name="add-circle-sharp" size={28} color={color.primaryend} onPress={() => { setModalVisible(true) }} style={{zIndex:1000}} />}
                  {/* <Ionicons name="add-circle-sharp" size={28} color={color.primaryend} onPress={() => { setModalVisible(true) }}  /> */}
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
                <VStack>
                {hideAddShift ?
                 <PressNTB onPress={()=>{setModalVisible(true)}}>
                 <VStack borderBottomColor={"#ccc"} p="2" borderBottomWidth={0.5} zIndex={100} bg={color.background} >
                           <HStack alignItems={"center"} justifyContent="space-between" borderBottomColor={color.backGroundView} borderBottomWidth={0.5} pb="2">
                             <HStack>
                               <FontAwesome5 name="calendar-alt" size={20} color={color.buttend} />
                               <Text ml="1" fontSize={16} text={`${dateYMD(pickDate)}`} fontWeight={"700"} color={color.buttend} />
                               <HStack ml="2"  >
                                 <Text fontWeight={"bold"} text="Ca :" fontSize={16} color={color.buttend} />
                                 <Text text="Hành chính" fontSize={16} fontWeight={"700"} color={color.buttend} />
                               </HStack>
                             </HStack>
                             <Icon as={<MaterialIcons name="delete" />} color={color.danger} size="xl" onPress={()=>{setHideAddShift(false)}} />
                           </HStack>
                           <HStack alignItems={"center"} justifyContent={"space-between"} mt="1">
                             <HStack alignItems={'center'}>
                               <AntDesign name="clockcircle" size={18} color={color.buttend} />
                               <Text ml="1" fontWeight={"500"} text="Thời gian:" opacity={0.8} />
                             </HStack>
                             <Text text={`${formatHHMMTimestamp(hhmmStart)} - ${formatHHMMTimestamp(hhmmEnd)}`} fontWeight={"bold"} />
                           </HStack>
                           <HStack justifyContent={"space-between"} mt="1">
                             <HStack alignItems={'center'}>
                               <FontAwesome5 name="share-alt" size={20} color={color.buttend} />
                               <Text ml="1" fontWeight={"500"} text="Loại ca:" opacity={0.8} />
                             </HStack>
                             <Text text={`${shiftcurrent['ten_ca']}`} fontWeight="bold" />
                           </HStack>
                           <HStack mb="1" justifyContent={"space-between"} mt="1">
                             <HStack alignItems={'center'}>
                               <Feather name="arrow-right-circle" size={20} color={color.buttend} />
                               <Text ml="1" text="Lí do:" opacity={0.8} />
                             </HStack>
                             <Text fontWeight={"bold"} text={`${reason['name']}`} />
                           </HStack>
                         </VStack>
                         </PressNTB>
 
                  :null}
                </VStack>
              </VStack>
            </PresenceTransition>
          </VStack>
          <FormInfoShift desc={()=>{}}  loopfilter={loopfilter.length > 0 ? [...loopfilter[0]['approvers'], ...loopfilter[1]['approvers']] : []}
            recipients={recipients} onPassingApprovers={SetarrApprover} onPassingRecipient={SetRecipient} />
            {leaveStore.status==="pending" ?   <Spinner tx="loginScreen.loading" color={"white"} bg="tertiary.500"  />  : <Pressable tx="absenceRequestScreen.sentform" onPress={OnConfirm}  />}
         
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
                    </HStack>
                    <VStack p="2">
                      <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())}
                        borderWidth="0" borderColor="transparent" onPassing={(e) => {
                          setPickDate(parseInt(moment(e).format('x')))
                        }} />
                    </VStack>
                  </VStack>
                  <VStack bg={color.backGroundView} p="2" mb="1">
                    <Text tx="leaveRequest.timestart" fontWeight={"bold"} fontSize={spacing[5]} />
                  </VStack>
                  <VStack px="2">
                    <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())} mode="time"
                      borderWidth="0" borderColor="transparent" onPassing={(e) => {
                        setHHMMStart(getHoursMinutesTimeStamp(e))
                      }} />
                  </VStack>
                  <VStack bg={color.backGroundView} p="2" mb="1">
                    <Text tx="leaveRequest.timeend" fontWeight={"bold"} fontSize={spacing[5]} />
                  </VStack>
                  <VStack px="2">
                    <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())} mode="time"
                      borderWidth="0" borderColor="transparent" onPassing={(e) => {
                        setHHMMEnd(getHoursMinutesTimeStamp(e))
                      }} />
                  </VStack>
                  <VStack bg={color.backGroundView} p="2" mb="1">
                    <Text tx="absenceRequestScreen.shiftwork" fontWeight={"bold"} fontSize={spacing[5]} />
                  </VStack>
                  <VStack p="2">
                    <Text tx="absenceRequestScreen.administrative" />
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
                    <Text text="Lí do" fontWeight={"bold"} fontSize={spacing[5]} />
                    <Text text="*" fontWeight={"bold"} color={color.danger} />
                  </HStack>
                  <VStack p="2">
                    <Radio.Group name="myRadidgdgoGroup" colorScheme="green" accessibilityLabel="li do" onChange={nextValue => {
                      setReason(arrLydo[`${nextValue}`])
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
                    if(reason['_id']){
                      toast.show({
                        placement:"top",
                        render :()=>{
                          return <ToastMessage text={"Chưa chọn lí do"} type="warning" />
                        }
                      })
                    }
                      setHideAddShift(true)
                      setIsOpen(true)
                      setModalVisible(false)
                  }} width={"100%"} />
                </VStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Box>
      </ScrollView>
    </Screen>
  )
})

       