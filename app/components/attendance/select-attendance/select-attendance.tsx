import * as React from "react"
import { FlatList, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../../theme"
import { Text } from "../../text/text"
import {Box ,Menu, Pressable} from "native-base";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useState } from "react"


export interface SelectAttendanceProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const SelectAttendance = observer(function SelectAttendance(props: SelectAttendanceProps) {

  const yearNow = new Date().getFullYear()
  const monthNow = new Date().getMonth()
  const [month, setMonth] = useState(monthNow)
  const [year , setYear] = useState(yearNow)
  const yearSelect = [
    {id:0,year:2019},
    {id:1,year:2020},
    {id:2,year:2021},
    {id:3,year:2022},
    {id:3,year:2023},
  ]
  const listMonth = [{
    id:1, name:"Jan",},
    {id:2,name:"Feb"},
  {id:3,name:"Mar"},
  {id:4,name:"Apr"},
  {id:5,name:"May"},
  {id:6,name:"Jun"},
  {id:7,name:"July"},
  {id:8,name:"Aug"},
  {id:9,name:"Sep"},
  {id:10,name:"Oct"},
  {id:11,name:"Nov"},
  {id:12,name:"Dec"}
]
  return (
    <Box flexDirection={"row"} alignItems="center" marginX={"5%"}>
        <Menu  placement="bottom right" trigger={triggerProps => {
        return <Pressable accessibilityLabel="More options menu" {...triggerProps} backgroundColor="#ffffff" borderRadius={5} paddingX={2}
        flexDirection="row" alignItems={"center"}
        >
                <Text text={`${year}`}   zIndex={100}/>
                <MaterialIcons name="arrow-drop-down" size={24} color="black" />
              </Pressable>;
      }}>
         
          {yearSelect.map((value,index)=>{
                          return (
                                <Menu.ItemOption key={index} onPress={()=>setYear(value.year)} value={value.year}>{`${value.year}`}</Menu.ItemOption>
                          )
                        })}
        </Menu>
        <FlatList 
          data={listMonth}
          horizontal={true}
          renderItem={({item,index})=> {
            return (
              <Box padding={2}>
               <Text key={index} text={item.name} onPress={()=>setMonth(item.id)} color={color.background} paddingX={2} fontSize={spacing[4]} />
              </Box>
            )
          }}
        
        />
    </Box>
  )
})
