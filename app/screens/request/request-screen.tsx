import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, useWindowDimensions, FlatList, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { AutoImage, AvatarName, Button, Screen, Text } from "../../components"
import { Header } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { color, spacing } from "../../theme"
import { Box, VStack, HStack, Pressable } from "native-base"
import { useStores } from "../../models"
import moment from "moment"
import { dateDMY } from "../../utils/common"
import { AntDesign,Ionicons } from '@expo/vector-icons';
import { Spinner } from "../../components"
const ROOT: ViewStyle = {
  flex: 1,
}

export const RequestScreen: FC<StackScreenProps<HomeStackParamsList, "request">> = observer(function RequestScreen({ navigation }) {

  const { requestStore } = useStores()
  const { listRequest } = requestStore
  let record = Math.floor(useWindowDimensions().height / 100)
  const [numberRecord, setNumberRecord] = useState<number>(record)
  const [skeleton, setSkeleton] = useState(true)
  const [spinner, SetSpinner] = useState(true);
  let startOfweek = parseInt(moment().startOf("week").weekday(1).format("x"))
  let endOfweek = parseInt(moment().endOf("week").weekday(7).format("x"))
  async function getSummary() {
    await requestStore.getSummary(startOfweek, endOfweek, numberRecord)
    if (listRequest) {
      setSkeleton(false)
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

    getSummary()
    return () => {
      setSkeleton(null)
      SetSpinner(null)
    }
  }, [numberRecord])

  return (
    <Screen style={ROOT} preset="fixed" statusBar="light-content">
      <Header leftIcon={true} headerTx="request.headerRequest" border={true} titleStyle={{ color: color.storybookDarkBg }}
        onLeftPress={() => { navigation.goBack() }} />
           <ScrollView  showsVerticalScrollIndicator={false}>
      <Box p={3}>
        <VStack >
          <VStack >
            <HStack mt={0} justifyContent="space-between" alignItems={"center"} background={"orange.100"}
              borderRadius={5} p={1} borderWidth={0.5} borderColor={"orange.400"}>
              <Text text="Bạn còn 0 ngày nghỉ phép" color={"orange.500"} fontWeight="bold" />
              <Text tx="request.see" fontWeight={"bold"} py={2} bg={"red.400"} px={5} borderRadius={5} color={color.background} />
            </HStack>
          </VStack>
          <HStack justifyContent={"space-between"} mt={4} >
            <VStack>
              <VStack alignItems={"center"} >
                <Pressable onPress={()=> navigation.navigate("absence")}>
                <AutoImage
                  source={require("../../../assets/images/nghi-phep.png")}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40
                  }}
                />
                </Pressable>
                <Text tx="request.absence" />
              </VStack>
              <VStack alignItems={"center"} mt={4}>
                <Pressable onPress={()=> navigation.navigate("misson")}>
                <AutoImage
                  source={require("../../../assets/images/cong-tac.png")}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40
                  }}
                />
                </Pressable>
                <Text tx="request.misson" />
              </VStack>

            </VStack>
            <VStack>
              <VStack alignItems={"center"} >
                <Pressable onPress={()=>navigation.navigate("leaverequest")}>
                <AutoImage
                  source={require("../../../assets/images/nghi-phep-2.png")}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40
                  }}
                />
                </Pressable>
                <Text tx="request.later" />
              </VStack>
              <VStack alignItems={"center"} mt={4}>
                <Pressable  onPress={()=> navigation.navigate("worktime")}>
                <AutoImage
                  source={require("../../../assets/images/nghi-che-do.png")}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40
                  }}
                />
                </Pressable>
                <Text tx="request.worktime" />
              </VStack>

            </VStack>
            <VStack>
              <VStack alignItems={"center"} >
                <Pressable onPress={()=>{
                  navigation.navigate("shiftmorerequest")
                }}>
                <AutoImage
                  source={require("../../../assets/images/tang-ca.png")}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40
                  }}
                />
                </Pressable>
                <Text tx="request.shiftmore" />
              </VStack>
              <VStack alignItems={"center"} mt={4}>
                <Pressable  onPress={()=>{ navigation.navigate("shiftChange")}}>
                <AutoImage
                  source={require("../../../assets/images/doi-ca.png")}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40
                  }}
                />
                </Pressable>
                <Text tx="request.shiftchange" />
              </VStack>

            </VStack>
            <VStack>
              <VStack alignItems={"center"} >
                <Pressable onPress={()=>{
                  navigation.navigate("overtime")
                }} >
                <AutoImage
                  source={require("../../../assets/images/lam-them.png")}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40
                  }}
                />
                </Pressable>
                <Text tx="request.overtime" />
              </VStack>
              <VStack alignItems={"center"} mt={4}>
                <Pressable  onPress={() => {navigation.navigate("checkIn")}}>
                <AutoImage
                  source={require("../../../assets/images/giai-trinh-cham-cong.png")}
                  resizeMode="cover"
                  style={{
                    width: 40,
                    height: 40
                  }}
                />
                </Pressable>
                <Text tx="request.checkin" />
              </VStack>

            </VStack>
          </HStack>
          <VStack mt={5}>
            <HStack justifyContent={"space-between"} alignItems={"center"} borderBottomWidth={1} borderBottomColor={color.backGroundView} py={2}>

              <Text tx="request.applicationoftheweek" fontSize={spacing[4]} fontWeight="bold" />
              <Text text="Tất cả" fontSize={spacing[4]} fontWeight="bold" onPress={() => navigation.navigate("searchrequest",{status:"Chờ duyệt",type:undefined})} />
            </HStack>
            <VStack space={1} h="lg"  >
           
              {
                skeleton ? <Spinner /> :
                [...listRequest].map((item,index)=>{
                  return (
                          <Pressable key={index}>
                          <Box mt="2" borderBottomColor={color.backGroundView} borderBottomWidth={1} p="2" >
                          
                            <VStack>
                            <HStack>
                              <VStack >
                                <AvatarName uri={item.createdBy['image']} name={item.createdBy['name']} />

                              </VStack>
                              <VStack ml="2" justifyContent="space-between">
                                <Text fontWeight={"bold"} fontSize={spacing[4]} tx={"request.absence"} />
                                <HStack alignItems={"center"}>
                                  <Ionicons name="md-calendar-sharp" size={16} color="black" />
                                  <Text lineHeight={"lg"} ml="1" >{`${dateDMY(item.createdDate)}`}</Text>
                                  <HStack mx={1} >

                                  { item.status?<AntDesign name="minuscircle" size={16} color={color.warning}  /> :<AntDesign name="pluscircle" size={16} color={color.success} />}
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
                                {/* <Text ml="1" text={`${item.absence[0]['shift_start']} -`} /> */}
                            {/* <Text ml="1" tx="request.selector" />
                              <Text ml="1" text={`${item.absence[0]['shift_current']['ten']}`} />
                              <Text ml="1" text={`${item.absence[0]['shift_current']['ten']}- `} /> */}

                            </HStack>
                              <HStack alignItems={"center"} my="2" ml="4">
                                <Ionicons name="ios-newspaper-outline" size={16} color="black" />
                                <Text ml="1" opacity={0.7} >{`Không có mô tả `}</Text>
                              </HStack>
                            </VStack>
                          </HStack>
                          <VStack  alignItems={"flex-end"} >
                            <Button  text="Hủy bỏ" style={{
                              backgroundColor: color.warning,
                            }} textStyle={{ color: "black" }} />
                          </VStack>  

                          </Box>
                        </Pressable>
                  )
                })
              }
              
            </VStack>
          </VStack>
        </VStack>
      </Box>
              </ScrollView>
    </Screen>
  )
})

// <FlatList
//   showsVerticalScrollIndicator={false}
//   refreshing={false}
//   onRefresh={OnRefresh}
//   onEndReached={onLoadMore}
//   onEndReachedThreshold={0}
//   initialNumToRender={5}
//   ListFooterComponent={footerComponentList}
//   data={[...listRequest]}
//   keyExtractor={(item) => item._id}
//   renderItem={({ item }) => {
//     return (
//       <Pressable >
//         <Box mt="2" borderBottomColor={color.backGroundView} borderBottomWidth={1} pb="2" >
        
//           <VStack>
//           <HStack>
//             <VStack >
//               <AvatarName uri={item.createdBy['image']} name={item.createdBy['name']} />

//             </VStack>
//             <VStack ml="2" justifyContent="space-between">
//               <Text fontWeight={"bold"} fontSize={spacing[4]} tx={"request.absence"} />
//               <HStack alignItems={"center"}>
//                 <Ionicons name="md-calendar-sharp" size={16} color="black" />
//                 <Text lineHeight={"lg"} ml="1" >{`${dateDMY(item.createdDate)}`}</Text>
//                 <HStack mx={1} >

//                 { item.status?<AntDesign name="minuscircle" size={16} color={color.warning}  /> :<AntDesign name="pluscircle" size={16} color={color.success} />}
//                 </HStack>
//                 <Text ml="1" >{`${item.status}`}</Text>
//               </HStack>
//             </VStack>
//           </HStack>
//         </VStack>

//         <HStack>
//           <VStack>
//             <HStack alignItems={"center"} my="2" ml="4">
//               <AntDesign name="clockcircleo" size={16} color="black" />
//               <Text lineHeight={"xs"} ml="1" tx="request.shift" />
//               {/* <Text ml="1" text={`${item.absence[0]['shift_start']} -`} /> */}
//           {/* <Text ml="1" tx="request.selector" />
//             <Text ml="1" text={`${item.absence[0]['shift_current']['ten']}`} />
//             <Text ml="1" text={`${item.absence[0]['shift_current']['ten']}- `} /> */}

//           </HStack>
//             <HStack alignItems={"center"} my="2" ml="4">
//               <Ionicons name="ios-newspaper-outline" size={16} color="black" />
//               <Text ml="1" opacity={0.7} >{`Không có mô tả `}</Text>
//             </HStack>
//           </VStack>
//         </HStack>
//         <VStack height={10} flex={1}>
//           <Button position="absolute" right={0} backgroundColor="blue.500" text="Hủy bỏ" style={{
//             backgroundColor: color.warning,
//           }} textStyle={{ color: "black" }} />
//         </VStack>  

//         </Box>
//       </Pressable>
//     )
//   }}

// />