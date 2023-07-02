import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Pressable as PressRNT } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { HomeStackParamsList } from "../../navigators"
import { Screen, Text, MenuHome } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { color } from "../../theme"
import { DrawerActions } from '@react-navigation/native';
import { Box, HamburgerIcon, VStack, HStack } from "native-base";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { BoxInfoHome } from "../../components/home/box-info-home/box-info-home"
export const HomeScreen: FC<StackScreenProps<HomeStackParamsList, "homerequest">> = observer(function HomeScreen({ navigation }) {

  return (
    <Screen >

      <Box h={220} bg={color.primaryStart} >
        <VStack bgColor={color.primaryStart} >
          <Box justifyContent={"space-between"} alignItems="center" flexDirection={"row"} paddingX={5} paddingY={2}>
            <Text text="UGBM" fontWeight={"bold"} fontSize="18" color={color.background} />
            <PressRNT onPress={() => { navigation.dispatch(DrawerActions.openDrawer()) }}>
              <HamburgerIcon size={30} color="#ffffff" />
            </PressRNT>
          </Box>
          <BoxInfoHome />
        </VStack>
      </Box>
      <Box mt="10" >
        <VStack>
          <HStack justifyContent="space-around" flexWrap={"wrap"} padding={5}>
            <MenuHome tx="homeScreen.attendance" icon={<AntDesign name="codepen-circle" size={35} color={color.buttend} />} onPress={() => { navigation.navigate("attendance") }} />
            <MenuHome tx="request.headerRequest" icon={<FontAwesome5 name="user-clock" size={35} color={color.buttend} />} onPress={() => navigation.navigate("request")} />
          </HStack>
        </VStack>
      </Box>
    </Screen>
  )
})
