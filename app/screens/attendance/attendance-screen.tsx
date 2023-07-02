import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StatusBar, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { Button, Header, Pressable, Screen, Select, SelectAttendance, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { Box ,VStack} from "native-base"

import { HistoryAttendance } from "../../components"
import { CalendarAttendance } from "../../components"

const ROOT: ViewStyle = {
  flex: 1,
}


export const AttendanceScreen: FC<StackScreenProps<HomeStackParamsList, "attendance">> = observer(function AttendanceScreen({ navigation }) {
  const OnLeftPress = () => {
    navigation.navigate("homerequest")
  }
  const ChangeViewAttendanceHistory = () => {
    setViewAttendance(false)
  }
  const ChangeViewAttendanceCalendar = () => {
    setViewAttendance(true)
  }
  const [dataMonth ,setDataMonth] = useState({})
  const getDataNumberMonth = (data:any):void =>{
    setDataMonth(data)
  }
  const [viewAttendance, setViewAttendance] = useState<boolean>(true);
  return (
    <Screen style={ROOT} preset="fixed" statusBar="light-content">
      <Header border={false} headerTx="attendanceScreen.headerText" leftIcon={true} onLeftPress={OnLeftPress} bgColor={color.primaryStart} titleStyle={{
        color: color.background
      }} colorLeftIons={color.background} />
      <Box backgroundColor={color.primaryStart}>
        <Box flexDirection={"row"} justifyContent="space-around" paddingBottom={5} >
          <Box borderBottomWidth={viewAttendance ? 2 : 1} borderBottomColor={viewAttendance ? color.background : color.transparent}  >
            <Text fontSize={spacing[5]} opacity={viewAttendance ? 1 : 0.3} fontWeight="400" tx="attendanceScreen.canlendar" color={color.background} onPress={ChangeViewAttendanceCalendar} />
          </Box>
          <Box borderBottomWidth={!viewAttendance ? 2 : 1} borderBottomColor={!viewAttendance ? color.background : color.transparent}  >
            <Text fontSize={spacing[5]}  opacity={!viewAttendance ? 1 : 0.3} fontWeight="400" tx="attendanceScreen.history" color={color.background} onPress={ChangeViewAttendanceHistory} />
          </Box>
        </Box>
        <Box >

          {!viewAttendance ?
            <SelectAttendance />
            : <Box />}
        </Box>
        <VStack marginX={"5%"} flexDirection="row" justifyContent={"space-around"} paddingY={2} marginBottom={"-7%"} 
        zIndex={1000}  backgroundColor={color.background} borderRadius={5} shadow={5} >
          <Box  >
            <Text text={ dataMonth['congthang']===undefined ? '0':`${dataMonth['congthang']}`} textAlign={"center"} fontSize={spacing[6]} color={color.success} />
            <Text tx="attendanceScreen.pesent" fontWeight={"bold"} fontSize={spacing[4]} />
          </Box>
          <Box  >
            <Text text={dataMonth['congthang']===undefined ? '0':`${dataMonth['vangmat']}`} textAlign={"center"} fontSize={spacing[6]} color={color.warning} />
            <Text tx="attendanceScreen.absent" fontWeight={"bold"} fontSize={spacing[4]} />
          </Box>
          <Box  >
            <Text text={dataMonth['congthang']===undefined ? '0':`${dataMonth['dimuon']}`} textAlign={"center"} fontSize={spacing[6]} color={color.danger} />
            <Text tx="attendanceScreen.late" fontWeight={"bold"} fontSize={spacing[4]} />
          </Box>
        </VStack>
      </Box>
      <Box zIndex={-1} marginTop={5}>
        { !viewAttendance ? <HistoryAttendance  /> : <CalendarAttendance  handleData={getDataNumberMonth}/>}
       
      </Box>
     
    </Screen>
  )
})
