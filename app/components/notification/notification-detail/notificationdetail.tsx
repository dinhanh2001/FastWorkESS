import * as React from "react"
import {   StyleSheet, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import {dateDMY } from "../../../utils/common"
import { Text } from "../../text/text"
import HTMLView from 'react-native-htmlview';
import Moment from 'react-moment';
import { HStack } from "native-base"
import { spacing } from "../../../theme"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  padding:"5%"
}

export interface Data {
  summary:string
  datetime:number
  _id:string
  sender:object
  url:string
  content:object
}
export interface NotificationdetailProps {
 
  data?:Data
  
}

/**
 * Describe your component here
 */
export const Notificationdetail = observer(function Notificationdetail(props: NotificationdetailProps) {
  const {data } = props
  
  return (
    <View style={CONTAINER}>
      <HStack  flexDirection="row" justifyContent="center" alignItems={"center"} >
          <Text fontWeight={"bold"} fontSize={25} tx="notificationDetailScreen.messagefrom"  />
          <Text fontWeight={"bold"} fontSize={25} text={` ${data.sender['name']}`}  />
     
      </HStack>
      <HStack  justifyContent={"flex-end"} alignItems="center" >
          <Moment element={Text} fromNow={true} style={{
            fontSize:20,
          }} >{data.datetime}</Moment>
          <Text fontSize={20} text={`, ${dateDMY(data.datetime)}`} />

      </HStack>
      
        {
          data.content['title'] ?(
            <HStack  justifyContent={"flex-start"} alignItems="center" >
          <Text fontSize={20} tx="notificationDetailScreen.title" />
          <Text fontSize={20} text={` ${data.content['title']}`} /> 
          </HStack>
          ):null
        }
      <Text tx="notificationDetailScreen.content" color="yellow.500" fontWeight={"bold"} />
    
      <HTMLView
            stylesheet={styles}
              value={ `<div  >${data.summary}</br></div>`}
              />
        <HTMLView 
          value={`<a href="${data.url}" style="color:red;">Thực hiện công việc</a>`}
        />
    </View>
  )
})
const styles = StyleSheet.create({
  div: {
    fontWeight: '500',
    fontSize:spacing[4],
  },
});
