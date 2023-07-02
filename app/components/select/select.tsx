import * as React from "react";
import {Image} from "react-native"
import { Select as SelectNTB , CheckIcon,Box ,ISelectProps,Menu, Pressable, HamburgerIcon} from "native-base";
import  MaterialIcons  from '@expo/vector-icons/MaterialIcons';
import { color } from "../../theme";
export interface SelectProps extends ISelectProps{
   
}
export function Select(props:SelectProps){
    let [language, setLanguage] = React.useState("");
    const {style ,...rest} = props
    
    //hinh-anh-co-nuoc-anh
    const arrLanguage = [
        {
            id:0,
            name:"Việt Nam",
            value:"vi",
            uri:require("../../../assets/images/hinh-anh-co-viet-nam.png")
        },
        {
            id:2,
            name:"English",
            value:"en",
            uri:require("../../../assets/images/hinh-anh-co-nuoc-anh.png")
        },
    ]
    return (
        <Box {...rest} >
                     <Menu w="190" placement="bottom right" trigger={triggerProps => {
      return <Pressable accessibilityLabel="More options menu" {...triggerProps} >
            <MaterialIcons name="language" size={30} color={color.background} />
            </Pressable>;
    }}>
        <Menu.OptionGroup type="radio" title="Select Language">
        {arrLanguage.map((value,index)=>{
                        return (
                            <Box key={index}  flexDirection={"row"} alignItems="center" justifyContent={"center"} paddingX={2}>
                                 <Image 
                                    source={value.uri}
                                    style={{
                                        width:20,height:20,
                                    }}
                                    />
                                    <Menu.ItemOption value={value.value}>{value.name}</Menu.ItemOption>
                            </Box>
                        )
                       })}
                       </Menu.OptionGroup>
      </Menu>
        </Box>
    )
}