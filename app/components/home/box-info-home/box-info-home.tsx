import * as React from "react"
import { useState } from "react"
import { observer } from "mobx-react-lite"
import { color } from "../../../theme"
import { Text } from "../../text/text"
import { Box, HStack, VStack, Avatar, useToast } from "native-base"
import { HomeStackParamsList } from "../../../navigators"
import { StackNavigationProp } from "@react-navigation/stack"
import { dateHHMMSS } from "../../../utils/common"
import { Pressable } from "../../pressable/pressable"
import { ButtonDisabled } from "../../button-disabled/button-disabled"
import { useStores } from "../../../models"
import { Places } from "../../places/places"

export interface BoxInfoHomeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  navigation?: StackNavigationProp<HomeStackParamsList>
}
/**
 * Describe your component here
 */
export const BoxInfoHome = observer(function BoxInfoHome(props: BoxInfoHomeProps) {
  // const { navigation } = props
  const { authenticationStore, TimesheetStore, locationStore } = useStores()
  const [isShow, setIsShow] = useState<boolean>(false)
  // const [ isCheckin, setisCheckin ] = useState<boolean>(true)
  const toast = useToast();

  const onShow = (e) => {
    setIsShow(e)
  }
  const heightResponsive = {base: 'md', md: 'lg', lg: 'xl'}
  
  return (
    <Box m="2"  >
      <Box bgColor={color.background} p={5} borderRadius={10} shadow="5" top={5} position={"absolute"} w="100%"  >
        <VStack flexDirection="row" justifyContent="space-evenly">
          {TimesheetStore.result == null ?
            <VStack  width={"60%"}>
              <Text tx="homeScreen.welcome" fontWeight={"bold"}  />
              <Text text={`${authenticationStore.name}`} fontWeight={"bold"} />
              <Text text={`${dateHHMMSS(new Date())}`} color={"blue.500"} fontSize={"sm"} fontWeight={"bold"} />
            </VStack>
            :
            <VStack  width={"70%"}>
              <Text text={`${authenticationStore.name}`} fontWeight={"bold"} />
              <Text tx="checkinScreen.productive" style={{ paddingVertical: 1, color: "green", fontWeight: "bold" }} />
            </VStack>
          }
          <Avatar source={{ uri: authenticationStore.image }} size="md">
            <Avatar.Badge bg="green.500" />
          </Avatar>
        </VStack>
        {TimesheetStore.result == null ?
          <VStack>
            <HStack flexDirection={"row"} justifyContent="space-between" marginTop={5} >
              <Pressable tx="homeScreen.checkin" w={[24, 48, 72]}
                onPress={() => {
                  setIsShow(true)
                  console.log("Button Check in")
                }} />
              <ButtonDisabled tx="homeScreen.checkout" w={[24, 48, 72]} onPress={() => console.log("Button Check out")} />
            </HStack>
          </VStack>
          :
          <VStack>
            <HStack flexDirection={"row"} justifyContent="space-between" marginTop={5} >
              <ButtonDisabled tx="homeScreen.checkin" w={[24, 48, 72]} onPress={() => console.log("Button Check in")} />
              <Pressable tx="homeScreen.checkout" w={[24, 48, 72]}
                onPress={async () => {
                  console.log("visit out: ",TimesheetStore.result['target']['visitOut'])
                  if(TimesheetStore.result['target']['visitOut'] == true) {
                    setIsShow(true)
                  } else{
                    setIsShow(true)
                  }
                  console.log("Button Check out")
                }} />
            </HStack>
          </VStack>}
      </Box>
      {isShow && <Places onShow={onShow} />}
    </Box>
  )
})