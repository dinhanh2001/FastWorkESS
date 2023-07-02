import React, { useEffect, useLayoutEffect, useState } from "react"
import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme, getFocusedRouteNameFromRoute } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { navigationRef, useBackButtonHandler } from "./navigation-utilities"
import { Box, NativeBaseProvider } from "native-base"
import { useStores } from "../models"
import {
  HomeScreen,
  NotificationsScreen,
  AccountScreen,
  LoginScreen,
  DetailNotificationScreen,
  ProfileDetailsScreen,
  UpdateProfileScreen,
  AttendanceScreen,
  RequestAbsenceScreen,
  RequestScreen,
  RequestSearchScreen,
  DetailsRequestScreen,
  LeaveScreen,
  OvertimeScreen,
  MissonRequestScreen,
  WorkTimeScreen,
  ShiftChangeScreen,
  CheckInScreen,
} from "../screens"
import { observer } from "mobx-react-lite"
import "react-native-gesture-handler"
import { color as ColorTheme } from "../theme"
import { Text } from "../components"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { DrawerCustom } from "../components/home/drawer-custom/drawer-custom"
import { LogBox } from "react-native";
import Entypo from "@expo/vector-icons/Entypo"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ShiftmoreScreen } from "../screens/shiftmore/shiftmore-screen"
LogBox.ignoreLogs([
  "exported from 'deprecated-react-native-prop-types'.",
])
export type NotificationParamsList = {
  notificationList: undefined
  DetailNotificationScreen: object
}
const NotifiStacks = createNativeStackNavigator<NotificationParamsList>()
const NotifiStack = ({ navigation, route }) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  useEffect(() => {
    if (routeName !== "DetailNotificationScreen") {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } })
    }
    else {
      navigation.setOptions({ tabBarStyle: { display: 'none' } })
    }
    return () => { }
  }, [navigation, route])
  return (
    <NotifiStacks.Navigator initialRouteName="notificationList">
      <NotifiStacks.Screen
        name="notificationList"
        component={NotificationsScreen}
        options={{
          headerShown: false,
        }}
      />
      <NotifiStacks.Screen
        name="DetailNotificationScreen"
        component={DetailNotificationScreen}
        options={{
          headerShown: false,

        }}
      />
    </NotifiStacks.Navigator>
  )
}
export type DrawerHome = {
  home: undefined
}
const DrawerHome = createDrawerNavigator<DrawerHome>();
const HomerequestDrawer = () => {
  return (
    <DrawerHome.Navigator screenOptions={{
      drawerType: "front"
    }} drawerContent={(props) => <DrawerCustom {...props} />}>
      <DrawerHome.Screen name="home" component={HomeScreen} options={{
        headerShown: false,
        drawerIcon: ({ color, size, focused }) => (
          <Box flexDirection={'row'} alignItems="center" justifyContent={"center"} >
            <Entypo name="home" size={24} color={focused ? ColorTheme.background : ColorTheme.primaryend} />
            <Text text="Trang chủ" paddingX={2} color={focused ? ColorTheme.background : ColorTheme.primaryend} />
          </Box>
        ),
        title: "",
        drawerActiveBackgroundColor: ColorTheme.buttend

      }} />
    </DrawerHome.Navigator>
  )
}
export type HomeStackParamsList = {
  homerequest: undefined
  attendance: undefined
  absence: undefined
  request: undefined
  searchrequest: { type: string, status: string }
  detailsrequest: { _id: string, type: string }
  leaverequest: undefined
  shiftmorerequest: undefined
  overtime: undefined
  misson: undefined
  worktime: undefined
  shiftChange:undefined
  checkIn:undefined
}
const HomeStack = createNativeStackNavigator<HomeStackParamsList>();

const HomeStackApp = ({ navigation, route }) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  useEffect(() => {
    if (routeName !== "attendance" && routeName !== "request" && routeName !== "searchrequest" &&
      routeName !== "absence" && routeName !== "detailsrequest" && routeName !== "leaverequest" && routeName !== "shiftmorerequest"
      && routeName !== "overtime" && routeName !== "misson" && routeName !== "worktime" && routeName !== "shiftChange"
      && routeName !== "checkIn") {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } })
    }
    else {
      navigation.setOptions({ tabBarStyle: { display: 'none' } })
    }
    return () => { }
  }, [navigation, route])
  return (
    <HomeStack.Navigator initialRouteName="homerequest" screenOptions={{
      animation: "slide_from_right",
      animationDuration: 2000,
    }}>
      <HomeStack.Screen name="homerequest" component={HomerequestDrawer} options={{
        headerShown: false
      }} />
      <HomeStack.Screen name="attendance" component={AttendanceScreen} options={{
        headerShown: false
      }} />
      <HomeStack.Screen name="request" component={RequestScreen} options={{
        headerShown: false
      }} />
      <HomeStack.Screen name="absence" component={RequestAbsenceScreen} options={{
        headerShown: false
      }} />
      <HomeStack.Screen name="searchrequest" component={RequestSearchScreen} options={{
        headerShown: false,
      }} />
      <HomeStack.Screen name="detailsrequest" component={DetailsRequestScreen} options={{
        headerShown: false,
      }} />
      <HomeStack.Screen name="leaverequest" component={LeaveScreen} options={{
        headerShown: false,
      }} />
      <HomeStack.Screen name="shiftmorerequest" component={ShiftmoreScreen} options={{
        headerShown: false,
      }} />
      <HomeStack.Screen name="overtime" component={OvertimeScreen} options={{
        headerShown: false,
      }} />
      <HomeStack.Screen name="misson" component={MissonRequestScreen} options={{
        headerShown: false,
      }} />
      <HomeStack.Screen name="worktime" component={WorkTimeScreen} options={{
        headerShown: false,
      }} />
       <HomeStack.Screen name="shiftChange" component={ShiftChangeScreen} options={{
        headerShown: false,
      }} />
      <HomeStack.Screen name="checkIn" component={CheckInScreen} options={{
        headerShown: false,
      }} />
    </HomeStack.Navigator>
  )
}
export type BottomsParamList = {
  home: undefined
  notification: undefined
  account: undefined
}
const BottomTabs = createBottomTabNavigator<BottomsParamList>()

const DrawerApp = () => {
  const { notificationStore } = useStores()
  const [number, setNumber] = useState<number>()
  useEffect(() => {
    const numberNotifi = async () => {
      let numberNewNotifi = notificationStore.getNumberNotification()
      let Number = await numberNewNotifi
      if (Number) {
        setNumber(number)
      }
    }

    numberNotifi()
    return () => { }
  }, [])
  return (
    <BottomTabs.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true
      }}
    >
      <BottomTabs.Screen
        name="home"
        component={HomeStackApp}
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused, size, color }) => {
            return (
              <>
                <Entypo
                  name="home"
                  size={25}
                  color={focused ? ColorTheme.buttend : ColorTheme.bottomTabFocus}
                />
                <Text tx="bottomtabs.home" />
              </>
            )
          },
          headerTitleStyle: { opacity: 0 },
        }}
      />
      <BottomTabs.Screen
        name="notification"
        component={NotifiStack}
        options={() => ({
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => {
            return (
              <>
                <Ionicons
                  name="ios-notifications-sharp"
                  size={24}
                  color={focused ? ColorTheme.buttend : ColorTheme.bottomTabFocus}
                />
                <Text tx="bottomtabs.notification" />
              </>
            )
          },
          tabBarBadge: number > 0 ? number : "",
          tabBarBadgeStyle: {
            backgroundColor: number > 0 ? ColorTheme.buttstart : "transparent",
            color: ColorTheme.background,
            textAlign: "center",
            padding: 1,
          },
        })}
      />
      <BottomTabs.Screen
        name="account"
        component={ProfileStack}
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused, size, color }) => {
            return (
              <>
                <FontAwesome
                  name="user"
                  size={24}
                  color={focused ? ColorTheme.buttend : ColorTheme.bottomTabFocus}
                />
                <Text tx="bottomtabs.profile" />
              </>
            )
          },
        }}
      />
    </BottomTabs.Navigator>
  )
}
export type AppStackParamList = {
  main: undefined
}
const AppStackList = createNativeStackNavigator<AppStackParamList>()
const AppStack = () => {
  return (
    <AppStackList.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="main"
    >
      <AppStackList.Screen
        name="main"
        component={DrawerApp}
        options={{
          headerShown: false,
        }}
      />
    </AppStackList.Navigator>
  )
}

export type AuthenParams = {
  login: undefined
}
const AuthenticationStack = createNativeStackNavigator<AuthenParams>()

const AuthStack = () => {
  const { authenticationStore } = useStores()
  useLayoutEffect(() => {
    return () => { }
  }, [authenticationStore])
  return (
    <AuthenticationStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="login"
    >
      <AuthenticationStack.Screen name="login" component={LoginScreen} />
    </AuthenticationStack.Navigator>
  )
}

export type profileParamList = {
  profileNav: undefined
  profileDetails: undefined
  updateProfile: undefined
}
const ProfileStacks = createNativeStackNavigator<profileParamList>()
const ProfileStack = ({ navigation, route }) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  useEffect(() => {
    if (routeName !== "profileDetails") {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } })
    }
    else {
      navigation.setOptions({ tabBarStyle: { display: 'none' } })
    }
    return () => { }
  }, [navigation, route])
  return (
    <ProfileStacks.Navigator
      initialRouteName="profileNav"
    >
      <ProfileStacks.Screen
        name="profileNav"
        component={AccountScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStacks.Screen
        name="profileDetails"
        component={ProfileDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStacks.Screen
        name="updateProfile"
        component={UpdateProfileScreen}
        options={{
          headerShown: false,

        }}
      />
    </ProfileStacks.Navigator>
  )
}
interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> { }
export const AppNavigator = observer((props: NavigationProps) => {
  const colorScheme = useColorScheme()
  useBackButtonHandler(canExit)
  const { authenticationStore } = useStores()
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <NativeBaseProvider>
        {authenticationStore.isAuthenticationStore ? <AppStack /> : <AuthStack />}
      </NativeBaseProvider>
    </NavigationContainer>
  )
})

AppNavigator.displayName = "AppNavigator"
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
