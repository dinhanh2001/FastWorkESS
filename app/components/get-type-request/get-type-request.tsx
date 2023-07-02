import * as React from "react"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
export interface GetTypeRequestProps {
  type:string
}
export const GetTypeRequest = observer(function GetTypeRequest(props: GetTypeRequestProps) {
  const { type } = props
  if(type==="later"){
    return (
      <Text color={ color.storybookDarkBg} fontWeight={"bold"} fontSize={spacing[4]}  tx="request.later" />
    )
  }
  else if (type==="absence") {
    return (
    <Text  color={ color.storybookDarkBg} fontWeight={"bold"} fontSize={spacing[4]}  tx="request.absence" />
    )
  }
  else if (type==="shiftmore") {
    return (
    <Text  color={ color.storybookDarkBg} fontWeight={"bold"} fontSize={spacing[4]}  tx="request.shiftmore" />
    )
  }
  else if (type==="overtime") {
    return (
    <Text  color={ color.storybookDarkBg} fontWeight={"bold"} fontSize={spacing[4]}  tx="request.overtime" />
    )
  }
  else if (type==="misson") {
    return (
    <Text  color={ color.storybookDarkBg} fontWeight={"bold"} fontSize={spacing[4]}  tx="request.misson" />
    )
  }
  else if (type==="shiftchange") {
    return (
    <Text  color={ color.storybookDarkBg} fontWeight={"bold"} fontSize={spacing[4]}  tx="request.shiftchange" />
    )
  }
  else if (type==="checkin") {
    return (
    <Text  color={ color.storybookDarkBg} fontWeight={"bold"} fontSize={spacing[4]}  tx="request.checkin" />
    )
  }
  else  {
    return (
    <Text  color={ color.storybookDarkBg} fontWeight={"bold"} fontSize={spacing[4]}  tx="request.worktime" />
    )
  }
})
