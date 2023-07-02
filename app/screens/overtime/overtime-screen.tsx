import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle ,ScrollView} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { DatePicker, FormInfoShift, Header, Pressable, Screen, Spinner, Text, TextField, ToastMessage } from "../../components"
import { MaterialIcons, Ionicons,FontAwesome5 ,AntDesign ,Feather } from '@expo/vector-icons';
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { Box ,VStack ,HStack ,Pressable as PressNTB,useToast ,PresenceTransition ,Icon ,Modal ,Radio} from "native-base"
import { dateYMD, formatHHMMTimestamp, getHoursMinutesTimeStamp } from "../../utils/common"
import moment from "moment"

const ROOT: ViewStyle = {
  flex: 1,
}


export const OvertimeScreen: FC<StackScreenProps<HomeStackParamsList, "overtime">> = observer(function OvertimeScreen({navigation}) {
  const [isOpen,setIsOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [hideAddShift ,setHideAddShift] = useState(false)
  const toast = useToast()
  const [arrgetShift, setArrgetShift] = useState([])
  const [pickDate, setPickDate] = useState<number>(new Date().getTime()) // ngay chon
  const [hhmmStart, setHHMMStart] = useState(new Date().getTime() - new Date().setHours(0, 0, 0, 0))
  const [hhmmEnd, setHHMMEnd] = useState(new Date().getTime() - new Date().setHours(0, 0, 0, 0))
  const [recipients,setRecipients] = useState([])
  const [approver ,setApprover] = useState([]) 
  const { categoriesStore ,leaveStore ,overtimeStore} = useStores()
  const [arrOvertime,setArrOvertime] = useState([])
  const [recipientApi, setRecipientApi] = useState([]) // mang nguoi thong bao
  const [approvers, setApprovers] = useState([]) // mang nguoi duyet
  const [shiftcurrent, setShiftcurrent] = useState<object>({}) // ca tang
  const [members ,setMembers] = useState([]) // magn members
  const [describe, setDescribe ] = useState<string>('') // mo ta
  const [noteOvertime,setNoteOvertime] = useState('') // note
  let Overtime = {
    date_start: pickDate,
    shift_current: shiftcurrent,
    time_start: hhmmStart,
   time_end: hhmmEnd,
   note:noteOvertime
  }
  const setNote = (data) =>{
    setNoteOvertime(data)
  }
  const SetRecipient = (data) => {
    setRecipientApi(data)
  }
  const SetarrApprover = (data) => {
    setApprovers(data)
  }
  const setDesc = (data) =>{
    setDescribe(data)
  }
  useEffect(()=>{
    const getData = async () =>{
      const arrGetShift = categoriesStore.getShift
      const recipients = categoriesStore.Recipients
      const approver = categoriesStore.Approver
      const Approvers = await approver("overtime")
      const Recipients = await recipients()
      const GetShift = await arrGetShift() 
     const arryfilter = Approvers[0]['levels'] ? categoriesStore.flatArray(Approvers[0]['levels']): Approvers[0]['approvers']
      if(GetShift || Approvers || Recipients){
        setArrgetShift(GetShift)
       setApprover([...arryfilter,...Approvers[1]['approvers']])
        setRecipients(Recipients['recipients'])
      }

    }
    getData()
  },[])
  const OnConfirm = async () =>{
    overtimeStore.setDataOvertime(arrOvertime,members,recipientApi,approvers,describe)
    const sentFormOvertime = overtimeStore.createOvertime
    const SentForm = await sentFormOvertime()
    if(SentForm.active){
      toast.show({
        duration:500,
        placement:"top",
        render :()=>{
          return <ToastMessage tx="shared.createSuccess" type="success" />
        }
      })
    navigation.navigate("searchrequest",{type:"overtime",status:"Chờ duyệt"})
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
    <Screen style={ROOT} preset="scroll">
    <Header leftIcon={true} headerTx="overtimeRequest.overtimeHeader" border={true} titleStyle={{ color: color.storybookDarkBg }}
        onLeftPress={() => { navigation.goBack() }} />
         <ScrollView >
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
                 {
                  arrOvertime.map((value,index)=>{
                    return (
                      <PressNTB onPress={()=>{setModalVisible(true)}} key ={index}>
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
                             <Text text={`${formatHHMMTimestamp(value['time_start'])} - ${formatHHMMTimestamp(value['time_end'])}`} fontWeight={"bold"} />
                           </HStack>
                           <HStack justifyContent={"space-between"} mt="1">
                             <HStack alignItems={'center'}>
                               <FontAwesome5 name="share-alt" size={20} color={color.buttend} />
                               <Text ml="1" fontWeight={"500"} text="Loại ca:" opacity={0.8} />
                             </HStack>
                             <Text text={`${value['shift_current']['ten_ca']}`} fontWeight="bold" />
                           </HStack>
                         </VStack>
                         </PressNTB>
                    )
                  })
                 
 
                  }
                  </VStack>
                </PresenceTransition>
              </VStack>
            <FormInfoShift loopfilter={approver} recipients={recipients} onPassingApprovers={SetarrApprover}  onPassingRecipient={SetRecipient} desc={setDesc}/>
              {leaveStore.status==="pending" ?   <Spinner tx="loginScreen.loading" color={"white"} bg="tertiary.500"  />  : <Pressable tx="absenceRequestScreen.sentform" onPress={OnConfirm}  />}
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
                  <VStack bg={color.backGroundView} p="2" >
                    <Text tx="overtimeRequest.note" fontWeight={"bold"} fontSize={spacing[5]} />
                  </VStack>
                  <VStack >
                    <TextField  placeholderTx="overtimeRequest.note" onChangeText={(value)=>{ setNote(value)}}/>
                  </VStack>
                </VStack>
              </Modal.Body>
              <Modal.Footer >
                <VStack w={"100%"} >
                  <Pressable tx="absenceRequestScreen.confirm" onPress={() => {
                    setArrOvertime([...arrOvertime,Overtime])
                      setHideAddShift(true)
                      setIsOpen(true)
                      setModalVisible(false)
                  }} width={"100%"} />
                </VStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
    </Screen>
  )
})
