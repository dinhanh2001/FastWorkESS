import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { DatePicker, FormInfoShift, Header, Pressable, Screen, Spinner, Text, TextField, TimePicker, ToastMessage } from "../../components"
import { MaterialIcons, Ionicons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { Box, VStack, HStack, Modal, PresenceTransition, Pressable as PressNTB, useToast, Icon, Radio } from "native-base"
import { dateYMD, formatHHMMTimestamp, getHoursMinutesTimeStamp, testDateToDate } from "../../utils/common"
import moment from "moment"
import ModalSelector from "react-native-modal-selector-searchable"
const ROOT: ViewStyle = {
  flex: 1,
}
export const MissonRequestScreen: FC<StackScreenProps<HomeStackParamsList, "misson">> = observer(function MissonRequestScreen({ navigation }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [openmodal, setOpenmodal] = useState(false)
  const [pickTimeSt, setPickTimeSt] = useState(true)
  const [pickTimeEnd, setPickTimeEnd] = useState(true)
  const toast = useToast()
  const [arrayModal, setArrayModal] = useState([])
  const [arrgetShift, setArrgetShift] = useState([])
  const [pickDateStart, setPickDateStart] = useState<number>(parseInt(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x'))) // ngay chon dat dau
  const [pickDateEnd, setPickDateEnd] = useState<number>(parseInt(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x'))) // ngay chon ket thuc
  const [hhmmStart, setHHMMStart] = useState(28800000)//)
  const [hhmmEnd, setHHMMEnd] = useState(61200000)
  const [arrTemporary, setTemporary] = useState([])
  const [recipients, setRecipients] = useState([])
  const [approver, setApprover] = useState([])
  let [idChange, setIdChange] = useState(null)
  const { categoriesStore, leaveStore, missonStore } = useStores()
  const [arrMisson, setArrMisson] = useState([]) // mang don cong tac
  const [recipientApi, setRecipientApi] = useState([]) // mang nguoi thong bao
  const [approvers, setApprovers] = useState([]) // mang nguoi duyet
  const [shiftcurrent, setShiftcurrent] = useState<object>({}) // ca cong tac
  const [members, setMembers] = useState([]) // magn members
  const [describe, setDescribe] = useState<string>('') // mo ta
  const [address, setAddress] = useState('') // note
  let Misson = {
    date_start: pickDateStart,
    date_end: pickDateEnd,
    address: address,
    missons: arrMisson,
    recipients: recipientApi,
    members: members,
    approvers: approvers,
  }
  const onClose = () => { setOpenmodal(false) }
  const setAdressMisson = (data) => {
    setAddress(data)
  }
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
      const arrGetShift = categoriesStore.getShift
      const recipients = categoriesStore.Recipients
      const approver = categoriesStore.Approver
      const Recipients = await recipients()
      const GetShift = await arrGetShift()
      const Approvers = await approver("misson")
      console.log(Approvers)
      const arryfilter = Approvers[0]['levels'] ? categoriesStore.flatArray(Approvers[0]['levels']) : Approvers[0]['approvers']
      const arrModal = GetShift.map((value, index) => {
        return {
          label: `${value['ten_ca']}`,
          key: index
        }
      })
      setArrayModal(arrModal)
      if (GetShift || Approvers || Recipients) {
        setArrgetShift(GetShift)
        setApprover(arryfilter)
        setRecipients(Recipients['recipients'])
      }

    }
    getData()
  }, [])
  useEffect(() => {

  }, [pickTimeSt, refresh])
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
  const OpenPicktime = () => {
    setPickTimeSt(false)
  }
  const OpenPicktimeEnd = () => {
    setPickTimeEnd(false)
  }
  const setListDay = async () => {
    if (!testDateToDate(pickDateStart, pickDateEnd)) {

      setModalVisible(false)
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage text="Ngày bắt đầu phải nhỏ hơn ngày kết thúc công tác !!!" type="warning" />
        }
      })
    }
    else if (address.length == 0) {
      setModalVisible(false)
      toast.show({
        placement: "top",
        render: () => {
          return <ToastMessage text="Chưa chọn địa điểm công tác" type="warning" />
        }
      })
    }
    else {
      const getRender = missonStore.renderListDay
      setIsOpen(true)
      setModalVisible(false)
      const result = await getRender(pickDateStart, pickDateEnd, hhmmStart, hhmmEnd, shiftcurrent)
      const resultTemporary = await getRender(pickDateStart, pickDateEnd, hhmmStart, hhmmEnd, shiftcurrent)
      setTemporary(resultTemporary)
      setArrMisson(result)
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

      missonStore.setPropsMisson(pickDateStart,pickDateEnd,address,arrMisson,recipientApi,members,approvers)
      const sentFormMisson = missonStore.createMisson
      const SentForm = await sentFormMisson()
      if(SentForm.active){
        toast.show({
          duration:500,
          placement:"top",
          render :()=>{
            return <ToastMessage tx="shared.createSuccess" type="success" />
          }
        })
      navigation.navigate("searchrequest",{type:"misson",status:"Chờ duyệt"})
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
    <Screen style={ROOT} preset="fixed">
      <Header leftIcon={true} headerTx="missonRequest.missonHeader" border={true} titleStyle={{ color: color.storybookDarkBg }}
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
                {arrTemporary.length > 0 ?
                  arrTemporary.map((value, index) => {
                    return (
                      <Box key={index}>
                        <VStack borderBottomColor={"#ccc"} p="2" borderBottomWidth={0.5} zIndex={100} bg={color.background} >
                          <HStack alignItems={"center"} justifyContent="space-between" borderBottomColor={color.backGroundView} borderBottomWidth={0.5} pb="2">
                            <HStack>
                              <FontAwesome5 name="calendar-alt" size={20} color={color.buttend} />
                              <Text ml="1" fontSize={16} text={`${moment(value['date_start']).format('DD-MM-YYYY')}`} fontWeight={"700"} color={color.buttend} />

                            </HStack>
                            <Icon as={<MaterialIcons name="delete" />} color={color.danger} zIndex={1000} size="xl" onPress={() => deleteShift(index)} />
                          </HStack>
                          <HStack alignItems={"center"} justifyContent={"space-between"} mt="1"  >
                            <HStack alignItems={'center'}>
                              <AntDesign name="pushpin" size={18} color={color.buttend} />

                              <Text text="Ca được phân :" fontWeight={"500"} ml="1" />
                            </HStack>

                            {value['shift']['ten_ca'] ?
                              <Text text={`${value['shift']['ten_ca']}(${formatHHMMTimestamp(value['shift']['bat_dau'])}-${formatHHMMTimestamp(value['shift']['ket_thuc'])})`} fontSize={16} fontWeight={"700"} />
                              : <Text text="Chưa được phân ca" fontSize={16} fontWeight={"700"} />}
                          </HStack>
                          <PressNTB onPress={() => { OpenPicktime(); setIdChange(index) }} my="1">
                            <HStack alignItems={"center"} justifyContent={"space-between"} mt="1">
                              <HStack alignItems={'center'}>
                                <AntDesign name="clockcircle" size={18} color={color.buttend} />
                                <Text ml="1" fontWeight={"500"} text="Bắt đầu:" opacity={0.8} />
                              </HStack>
                              <Text text={`${formatHHMMTimestamp(value['time_start'])}`} fontWeight={"bold"} />
                            </HStack>
                          </PressNTB>
                          <PressNTB onPress={() => { OpenPicktimeEnd(); setIdChange(index) }} my="1">
                            <HStack alignItems={"center"} justifyContent={"space-between"} mt="1">
                              <HStack alignItems={'center'}>
                                <AntDesign name="clockcircle" size={18} color={color.buttend} />
                                <Text ml="1" fontWeight={"500"} text="Kết thúc:" opacity={0.8} />
                              </HStack>
                              <Text text={` ${formatHHMMTimestamp(value['time_end'])}`} fontWeight={"bold"} />
                            </HStack>
                          </PressNTB>
                          <PressNTB onPress={() => { setOpenmodal(true); setIdChange(index) }} zIndex={1000}  >
                            <HStack alignItems={"center"} justifyContent={"space-between"} mt="1" >
                              <HStack alignItems={"center"}>
                                <AntDesign name="select1" size={18} color={color.buttend} />
                                <Text ml="1" text={"Chọn lại ca"} />
                                <MaterialIcons name="arrow-drop-down" size={24} color={color.storybookDarkBg} />
                              </HStack>
                              {typeof value['selectChange'] == 'undefined' ? <Text text={`Chưa chọn`} fontWeight={"bold"} /> : <Text text={value['selectChange']} fontWeight={"bold"} />}

                            </HStack>
                          </PressNTB>
                        </VStack>
                      </Box>
                    )
                  })
                  : null

                }
              </VStack>
            </PresenceTransition>
          </VStack>
          <FormInfoShift inputDesc={false} loopfilter={approver} recipients={recipients} onPassingApprovers={SetarrApprover} onPassingRecipient={SetRecipient} desc={setDesc} />
          {leaveStore.status === "pending" ? <Spinner tx="loginScreen.loading" color={"white"} bg="tertiary.500" /> : <Pressable tx="absenceRequestScreen.sentform" onPress={OnConfirm} />}
          {/* <FormInfoShift  loopfilter={} recipients={} /> */}
        </Box>
      </ScrollView>
      <Modal isOpen={modalVisible} onClose={setModalVisible} size={"full"} backdropVisible={false}  >
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
                </HStack>
                <VStack p="2">
                  <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())}
                    borderWidth="0" borderColor="transparent" onPassing={(e) => {
                      setPickDateEnd(parseInt(moment(e).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('x')))
                    }} />
                </VStack>
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
              <VStack bg={color.backGroundView} p="2" mb="1">
                <Text tx="missonRequest.timestart" fontWeight={"bold"} fontSize={spacing[5]} />
              </VStack>
              <VStack px="2">
                <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())} mode="time"
                  borderWidth="0" borderColor="transparent" onPassing={(e) => {
                    setHHMMStart(getHoursMinutesTimeStamp(e))
                  }} />
              </VStack>
              <VStack bg={color.backGroundView} p="2" mb="1">
                <Text tx="missonRequest.timeend" fontWeight={"bold"} fontSize={spacing[5]} />
              </VStack>
              <VStack px="2">
                <DatePicker fontSize={spacing[4]} defaultValue={dateYMD(new Date().getTime())} mode="time"
                  borderWidth="0" borderColor="transparent" onPassing={(e) => {
                    setHHMMEnd(getHoursMinutesTimeStamp(e))
                  }} />
              </VStack>

              <VStack bg={color.backGroundView} p="2" >
                <Text tx="overtimeRequest.note" fontWeight={"bold"} fontSize={spacing[5]} />
              </VStack>
              <VStack >
                <TextField placeholderTx="overtimeRequest.note" onChangeText={(value) => { setAdressMisson(value) }} />
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer >
            <VStack w={"100%"} >
              <Pressable tx="absenceRequestScreen.confirm" onPress={() => { setListDay() }} width={"100%"} />
            </VStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <ModalSelector
        initValue={"Chọn ca"}
        data={arrayModal}
        visible={openmodal}
        onChange={(option) => {
          // let selectShift = arrTemporary
          // selectShift[idChange]['selectChange'] = option['label']
          // setTemporary(selectShift)
          // let changeShift = arrMisson
          // changeShift[idChange]['shift'] = arrgetShift[`${option['key']}`]
          // setArrMisson(changeShift)
          let arr1 = arrMisson.forEach((value, index) => {
            idChange == index ? value['shift'] = arrgetShift[`${option['key']}`] : null
          })
          let arr2 = arrTemporary.forEach((value, index) => {
            idChange == index ? value['selectChange'] = option['label'] : null
          })
          setArrMisson(arrMisson)
          setTemporary(arrTemporary)
          setOpenmodal(false)
        }}

        caseSensitiveSearch={true}
        touchableActiveOpacity={0}
        onCancel={onClose}
        renderItem={(info) => {
          return (
            <Text color={"black"} text={`${info["ten_ca"]}`} key={info.index} />
          )
        }}
        animationType="none"
        searchText={`Tìm kiếm`}
        cancelText={"Đóng"}
        cancelStyle={{
          backgroundColor: color.success,
        }}
        cancelTextStyle={{
          color: color.background,
        }}
      >
        <Text text="" />
      </ModalSelector>
      {pickTimeSt ?
        null :
        <TimePicker onPassing={(time) => {
          arrMisson.forEach((value, index) => {
            idChange == index ? value['time_start'] = getHoursMinutesTimeStamp(time) : null
          })
          arrTemporary.forEach((value, index) => {
            idChange == index ? value['time_start'] = getHoursMinutesTimeStamp(time) : null
          })
          setArrMisson(arrMisson)
          setTemporary(arrTemporary)
          setRefresh(!refresh)
          setPickTimeSt(true)
        }} isOpen={true} close={() => {
          setPickTimeSt(true)
          setRefresh(!refresh)
        }} />}
      {pickTimeEnd ?
        null :
        <TimePicker onPassing={(time) => {
          arrMisson.forEach((value, index) => {
            idChange == index ? value['time_end'] = getHoursMinutesTimeStamp(time) : null
          })
          arrTemporary.forEach((value, index) => {
            idChange == index ? value['time_end'] = getHoursMinutesTimeStamp(time) : null
          })
          setArrMisson(arrMisson)
          setTemporary(arrTemporary)
          setRefresh(!refresh)
          setPickTimeEnd(true)
        }} isOpen={true} close={() => {
          setPickTimeEnd(true)
          setRefresh(!refresh)
        }} />}


    </Screen>
  )
})
