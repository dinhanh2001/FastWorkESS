import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { Header, Pressable, Screen, Text ,DatePicker,Spinner, FormInfoShift, ToastMessage} from "../../components"
import { MaterialIcons, Ionicons,FontAwesome5 ,AntDesign ,Feather } from '@expo/vector-icons';
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { Box ,VStack,HStack,Pressable as PressNTB ,PresenceTransition,Radio,Modal,useToast,Icon} from "native-base"
import { dateYMD, formatHHMMTimestamp, stringYMD } from "../../utils/common"
import moment from "moment"
const ROOT: ViewStyle = {
  flex: 1,
}
export const ShiftmoreScreen: FC<StackScreenProps<HomeStackParamsList, "shiftmorerequest">> = observer(function ShiftmoreScreen({navigation,route}) {
  const [isOpen,setIsOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [hideAddShift ,setHideAddShift] = useState(false)
  const toast = useToast()
  const [arrgetShift, setArrgetShift] = useState([])
  const [pickDate, setPickDate] = useState<number>(new Date().getTime()) // ngay chon
  const [recipients,setRecipients] = useState([])
  const [approver ,setApprover] = useState([]) 
  const { categoriesStore ,leaveStore ,shiftMoreStore} = useStores()
  const [recipientApi, setRecipientApi] = useState([]) // mang nguoi thong bao
  const [approvers, setApprovers] = useState([]) // mang nguoi duyet
  const [shiftcurrent, setShiftcurrent] = useState<object>({}) // ca tang
  const [members ,setMembers] = useState([])
  const [describe, setDescribe ] = useState<string>('')
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
    const loadData = async ()=>{
      const shift= categoriesStore.getShift
      const recipients = categoriesStore.Recipients
      const approver = categoriesStore.Approver
      const Approvers = await approver("shiftmore")
      const Recipients = await recipients()
      const Shift = await shift()
     let arryfilter = categoriesStore.flatArray(Approvers[0]['levels'])
      if (Recipients || Approvers || Shift){
       setApprover([...arryfilter,...Approvers[1]['approvers']])
        setRecipients(Recipients['recipients'])
        setArrgetShift(Shift)
      }
    } 
    loadData()
  },[])
  const OnConfirm = async () =>{
    if(typeof shiftcurrent['ma_loai'] == "undefined"){
      toast.show({
        duration:500,
        placement:"top",
        render :()=>{
          return <ToastMessage text="Chưa chọn ca tăng" type="warning" />
        }
      })
    }
    else {

      shiftMoreStore.setDataShiftmore(pickDate,shiftcurrent,recipientApi,describe,members,approvers)
      const sentFormShiftmore = shiftMoreStore.createShiftmore
      const SentForm  = await sentFormShiftmore()
      if(SentForm.active){
        toast.show({
          duration:500,
          placement:"top",
          render :()=>{
            return <ToastMessage tx="shared.createSuccess" type="success" />
          }
        })
      navigation.navigate("searchrequest",{type:"shiftmore",status:"Chờ duyệt"})
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
      <Header leftIcon={true} headerTx="shiftmoreRequest.shiftmoreHeader" border={true} titleStyle={{ color: color.storybookDarkBg }}
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
                             <Text text={`${formatHHMMTimestamp(shiftcurrent['bat_dau'])} - ${formatHHMMTimestamp(shiftcurrent['ket_thuc'])}`} fontWeight={"bold"} />
                           </HStack>
                           <HStack justifyContent={"space-between"} mt="1">
                             <HStack alignItems={'center'}>
                               <FontAwesome5 name="share-alt" size={20} color={color.buttend} />
                               <Text ml="1" fontWeight={"500"} text="Loại ca:" opacity={0.8} />
                             </HStack>
                             <Text text={`${shiftcurrent['ten_ca']}`} fontWeight="bold" />
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
 
                  :null}
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
                  </VStack>
                  <VStack bg={color.backGroundView} p="2" >
                    <Text tx="shiftmoreRequest.shiftmoreHeader" fontWeight={"bold"} fontSize={spacing[5]} />
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
                  {/* <HStack bg={color.backGroundView} p="2" >
                    <Text tx="absenceRequestScreen.shift" fontWeight={"bold"} fontSize={spacing[5]} />
                    <Text text="*" fontWeight={"bold"} color={color.danger} />
                  </HStack>
                  <VStack p="2">
                    <Radio.Group name="dgdg" colorScheme="green" accessibilityLabel="Ca" onChange={nextValue => {
                     // setShift(nextValue)
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
                  </VStack> */}
                </VStack>
              </Modal.Body>
              <Modal.Footer >
                <VStack w={"100%"} >
                  <Pressable tx="absenceRequestScreen.confirm" onPress={() => {
                    // if (shift === "Cả ngày") {
                    //   setPeopleApprover(peopleApprover => (peopleApprover + 1))
                    // } else {
                    //   setPeopleApprover(peopleApprover => (peopleApprover + 0.5))
                    // }
                    // if (!arrAbsence.some(value => value == Absence)) {
                    //   setArrAbsence([...arrAbsence, Absence])
                    // }
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
