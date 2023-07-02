import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, FlatList, ScrollView, useWindowDimensions } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { AvatarName, DatePicker, Header, Screen, Spinner, Text } from "../../components"
import { Box, VStack, HStack, Pressable, Menu, Modal, Button as ButtonNTB, Checkbox } from "native-base"
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import {  dateYMD,dateDMYH } from "../../utils/common"
import { Button } from "../../components"
import moment from "moment"
import { GetTypeRequest } from "../../components"
const ROOT: ViewStyle = {
  flex: 1,
}

export const RequestSearchScreen: FC<StackScreenProps<HomeStackParamsList, "searchrequest">> = observer(function RequestSearchScreen({ navigation,route }) {
  let {status,type} = route.params
  const [tabActive, setTabActive] = useState(0)
  const [typeResuest, setTypeResuest] = useState(-1)
  const { requestStore } = useStores()
  const { listRequest } = requestStore
  let record = Math.floor(useWindowDimensions().height / 100)
  const [numberRecord, setNumberRecord] = useState<number>(record)
  const [skeleton, setSkeleton] = useState(true)
  const [spinner, SetSpinner] = useState(true);
  let [fromDate, SetFromDate] = useState(new Date().getTime())
  let [toDate, SetToDate] = useState(new Date().getTime())
  const [modalVisible, setModalVisible] = React.useState(false);
  let [statusApi, setStatusApi] = useState<string | undefined>(status)
  let [typeApi, setTypeApi] = useState<string | undefined>(type)
  let startOfweek = parseInt(moment().startOf("week").weekday(1).format("x"))
  let endOfweek = parseInt(moment().endOf("week").weekday(7).format("x"))
  async function getSummary() {
    const result = await requestStore.getSummary
    const data = result(startOfweek, endOfweek, numberRecord,typeApi,statusApi)
    if (data) {
      setSkeleton(false)
    }
    else {
      setSkeleton(true)
    }
  }
  const OnRefresh = () => {
    setSkeleton(true)
    getSummary()
  }
  const onLoadMore = () => {
    SetSpinner(false)
    setNumberRecord(numberRecord + 4)
    getSummary()
    SetSpinner(false)
  }
  const footerComponentList = () => {
    return (
      spinner ? <Spinner /> : null
    )
  }
  useEffect(() => {
    setSkeleton(true)
    getSummary()
    return () => {
      setSkeleton(null)
      SetSpinner(null)
    }
  }, [numberRecord,statusApi,typeApi])

  return (
    <Screen style={ROOT} preset="fixed" statusBar="light-content">
      <Header border={true} leftIcon={true} onLeftPress={() => navigation.navigate("request")} headerTx="searchRequestScreen.headerText"
        rightIcon={true} iconsRight={<Ionicons name="filter-sharp" size={24} color="black" />} onRightPress={() => {
          setModalVisible(true)
        }}
      />
      <Box p="2" >
        <VStack>
          <VStack>
            <ScrollView >
              <HStack justifyContent={"space-around"} pb="2" >
                <Pressable  >
                  <Menu mt="1" placement="bottom left" trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                      <HStack alignItems={"center"} borderRadius={10} bg={color.backGroundView} p={1} >
                        <Text tx="searchRequestScreen.typeRequest" />
                        <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
                      </HStack>
                    </Pressable>
                  }}>
                    <Menu.Item><Text onPress={() => { setTypeResuest(0) ;setTypeApi("later") }} color={typeResuest == 0 ? color.success : color.storybookDarkBg} tx="request.later" /></Menu.Item>
                    <Menu.Item><Text onPress={() => { setTypeResuest(1) ;setTypeApi("absence")}} color={typeResuest == 1 ? color.success : color.storybookDarkBg} tx="request.absence" /></Menu.Item>
                    <Menu.Item><Text onPress={() => { setTypeResuest(2) ;setTypeApi("shiftmore")}} color={typeResuest == 2 ? color.success : color.storybookDarkBg} tx="request.shiftmore" /></Menu.Item>
                    <Menu.Item><Text onPress={() => { setTypeResuest(3) ;setTypeApi("overtime")}} color={typeResuest == 3 ? color.success : color.storybookDarkBg} tx="request.overtime" /></Menu.Item>
                    <Menu.Item><Text onPress={() => { setTypeResuest(4) ;setTypeApi("misson")}} color={typeResuest == 4 ? color.success : color.storybookDarkBg} tx="request.misson" /></Menu.Item>
                    <Menu.Item><Text onPress={() => { setTypeResuest(5) ;setTypeApi("shiftchange")}} color={typeResuest == 5 ? color.success : color.storybookDarkBg} tx="request.shiftchange" /></Menu.Item>
                    <Menu.Item><Text onPress={() => { setTypeResuest(6) ;setTypeApi("checkin")}} color={typeResuest == 6 ? color.success : color.storybookDarkBg} tx="request.checkin" /></Menu.Item>
                    <Menu.Item><Text onPress={() => { setTypeResuest(7) ;setTypeApi("worktime")}} color={typeResuest == 7 ? color.success : color.storybookDarkBg} tx="request.worktime" /></Menu.Item>
                  </Menu>
                </Pressable>
                <Pressable borderRadius={10} bg={tabActive === 0 ? color.success : color.backGroundView}
                  onPress={() => {
                    setTabActive(0)
                    setStatusApi("Chờ duyệt")
                  }} px={2} justifyContent={"center"}>
                  <Text tx="searchRequestScreen.pending" color={tabActive === 0 ? color.background : "black"} py="1" />
                </Pressable>
                <Pressable borderRadius={10} bg={tabActive === 1 ? color.success : color.backGroundView}
                  onPress={() => {
                    setTabActive(1)
                    setStatusApi("Đã duyệt")
                  }} px={2} justifyContent={"center"}>
                  <Text tx="searchRequestScreen.approved" color={tabActive === 1 ? color.background : "black"}  py="1" />
                </Pressable>
                <Pressable borderRadius={10} bg={tabActive === 2 ? color.success : color.backGroundView}
                  onPress={() => {
                    setTabActive(2)
                    setStatusApi("Không duyệt")
                  }} px={2} justifyContent={"center"}>
                  <Text tx="searchRequestScreen.notapproved" color={tabActive === 2 ? color.background : "black"}  py="1" />
                </Pressable>


              </HStack>
            </ScrollView>
          </VStack>
          <VStack mb="100">
            {
              skeleton ? <Spinner /> :
                <FlatList
                  showsVerticalScrollIndicator={false}
                  refreshing={false}
                  onRefresh={OnRefresh}
                  onEndReached={onLoadMore}
                  onEndReachedThreshold={0}
                  initialNumToRender={5}
                  ListFooterComponent={footerComponentList}
                  data={[...listRequest]}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item,index }) => {
                    return ( 
                        <Box mt="2" borderBottomColor={color.backGroundView} borderBottomWidth={1} pb="2" key={index}>
                      <Pressable key={item._id} onPress={()=>{navigation.navigate("detailsrequest",{ _id:item._id,type:item.type})}}>
                          <VStack>
                            <HStack>
                              <VStack >
                                <AvatarName uri={item.createdBy['image']} name={item.createdBy['name']} />
                              </VStack>
                              <VStack ml="2" justifyContent="space-between">
                                 <GetTypeRequest  type={item.type} />
                                <HStack alignItems={"center"}>
                                  <Ionicons name="md-calendar-sharp" size={16} color="black" />
                                  <Text lineHeight={"lg"} ml="1" >{`${dateDMYH(item.createdDate)}`}</Text>
                                  <HStack mx={1} >

                                    {item.status ? <AntDesign name="minuscircle" size={16} color={color.warning} /> : <AntDesign name="pluscircle" size={16} color={color.success} />}
                                  </HStack>
                                  <Text ml="1" >{`${item.status}`}</Text>
                                </HStack>
                              </VStack>
                            </HStack>
                          </VStack>

                          <HStack>
                            <VStack>
                              <HStack alignItems={"center"} my="2" ml="4">
                                <AntDesign name="clockcircleo" size={16} color="black" />
                                <Text lineHeight={"xs"} ml="1" tx="request.shift" />
                              </HStack>
                              <HStack alignItems={"center"} my="1" ml="4">
                                <Ionicons name="ios-newspaper-outline" size={16} color="black" />
                                <Text ml="1" opacity={0.7} >{`Không có mô tả `}</Text>
                              </HStack>
                              <HStack alignItems={"center"} my="1" ml="4">
                              <Ionicons name="people" size={18} color={color.buttend} />
                                <Text ml="1" opacity={0.7} >{`Người duyệt :`}</Text>
                                {/* {item.approvers ? item.approvers.map((value,index)=>{
                                  return (
                                    <Text ml="1" opacity={0.7} text={`${value['name']},`} fontWeight="700"/>
                                  )
                                }) : <Text text="Bạn chưa chọn người duyệt " fontWeight="700" />} */}
                              </HStack>
                              <HStack alignItems={"center"} my="1" ml="4">
                              <Ionicons name="people" size={18} color={color.buttend} />
                                <Text ml="1" opacity={0.7} >{`Người theo dõi:`}</Text>
                                {/* {item.recipients.length > 0 ? item.approvers.map((value,index)=>{
                                  return (
                                    <Text ml="1" opacity={0.7} text={`${value['name']},`} fontWeight="700"/>
                                  )
                                }) : <Text text="Bạn chưa chọn người theo dõi" fontWeight="700" />} */}
                              </HStack>
                            </VStack>
                          </HStack>
                          <VStack height={10} flex={1}>
                            <Button position="absolute" right={0} backgroundColor="blue.500" text="Hủy bỏ" style={{
                              backgroundColor: color.warning,
                            }} textStyle={{ color: "black" }} />
                          </VStack>

                      </Pressable>
                        </Box>
                    )
                  }}

                />
            }


          </VStack>
        </VStack>
      </Box >
        <Modal isOpen={modalVisible} onClose={setModalVisible} size={"full"} backdropVisible={false} >
          <Modal.Content h="100%" >
            <Modal.CloseButton onPress={() => {
              setModalVisible(false)
            }} />
            <Modal.Header >
              <Text tx="searchRequestScreen.filter" fontWeight={"bold"} fontSize={spacing[5]} />
            </Modal.Header>
            <Modal.Body p="0" mt="1">
              <VStack>
                <ScrollView>
                  <VStack>
                    <VStack w="100%" p="0" >

                      <VStack bg={color.backGroundView} p="2" >
                        <Text text="Trạng thái" fontWeight={"bold"} fontSize={spacing[5]} />
                      </VStack>
                      <DatePicker defaultValue={dateYMD(fromDate)} placeholder="Từ :" placeholderTextColor={color.storybookDarkBg}
                        borderWidth="0" borderColor="transparent" onPassing={(e) => SetFromDate(e)} />
                      <DatePicker defaultValue={dateYMD(toDate)} placeholder="Đến :" placeholderTextColor={color.storybookDarkBg}
                        borderWidth="0" borderColor="transparent" onPassing={(e) => SetToDate(e)} />
                    </VStack>
                  </VStack>
                  <VStack bg={color.backGroundView} p="2" >
                    <Text text="Trạng thái" fontWeight={"bold"} fontSize={spacing[5]} />
                  </VStack>

                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2">
                    <Text text="Đồng ý" />
                    <Checkbox value="success" colorScheme={"green"} onChange={(isSeclected) => {
                     
                    }}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2"  >
                    <Text text="Đang chờ" />
                    <Checkbox value="pending" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2">
                    <Text text="Hủy bỏ" />
                    <Checkbox value="notapproved" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <VStack bg={color.backGroundView} p="2" >
                    <Text text="Loại đơn" fontWeight={"bold"} fontSize={spacing[5]} />
                  </VStack>

                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2">
                    <Text text="Xin nghỉ phép" />
                    <Checkbox value="absence" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2"  >
                    <Text text="Xin vắng mặt" />
                    <Checkbox value="later" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2">
                    <Text text="Xin tăng ca" />
                    <Checkbox value="overtime" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2">
                    <Text text="Xin công tác" />
                    <Checkbox value="collaborate" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2">
                    <Text text="Xin chế độ" />
                    <Checkbox value="regime" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2">
                    <Text text="Xin đổi ca" />
                    <Checkbox value="shiftchange" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                  <HStack justifyContent={"space-between"} w="100%" mb="1" py="1" px="2">
                    <Text text="Xin giải trình" />
                    <Checkbox value="explanation" colorScheme={"green"}>
                      <Text text="" color="transparent" />
                    </Checkbox>
                  </HStack>
                </ScrollView>
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <ButtonNTB.Group >
                <ButtonNTB bg={"green.500"} onPress={() => {
                  setModalVisible(false);
                }}>
                  <Text tx="leaveScreen.apply" color={color.background} />
                </ButtonNTB>
              </ButtonNTB.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
    </Screen>
  )
})
