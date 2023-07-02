import * as React from "react"
import {   StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../../theme"
import { Text } from "../../text/text"
import { Box } from "native-base"




export interface BoxNoDataCalendarProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const BoxNoDataCalendar = observer(function BoxNoDataCalendar(props: BoxNoDataCalendarProps) {
 

  return (
    <Box  bg={color.backGroundView} margin={"5%"} borderRadius={5} padding={5} justifyContent="space-around" height={150}>
     
      <Text  textAlign={"center"} tx="attendanceScreen.checkdataBox" />
    </Box>
  )
})
