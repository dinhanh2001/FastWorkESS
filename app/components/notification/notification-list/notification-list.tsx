import * as React from "react"
import {
  StyleProp,
  ViewStyle,
  FlatList,
  StyleSheet,
  useWindowDimensions,
} from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../../theme"
import { Text } from "../../text/text"
import HTMLView from "react-native-htmlview"
import { useEffect, useState } from "react"
import { useStores } from "../../../models"
import { Box, IPressableProps, Pressable, HStack, VStack } from "native-base"
import { NotificationParamsList } from "../../../navigators"
import { StackNavigationProp } from "@react-navigation/stack"
import { Spinner } from "../../spinner/spinner"
import Moment from 'react-moment';
Moment.globalLocale = 'vi'
import Skeletonnotifi from "../skeletonnotifi/skeletonnotifi";
import { AvatarName } from "../../avatar-name/avatar-name"

export interface NotificationListProps extends IPressableProps {
  style?: StyleProp<ViewStyle>
  navigation?: StackNavigationProp<NotificationParamsList>
}
export const NotificationList = observer(function NotificationList(props: NotificationListProps) {

  const { style, navigation, ...rest } = props
  const height = useWindowDimensions().height
  const [spinnerLoad, setSpinnerLoad] = useState(true)
  const record = Math.ceil(height / 80);
  const [countRecord, setCountRecord] = useState<number>(record);
  const [skeleton, setSkeleton] = useState<boolean>(true);
  const { notificationStore } = useStores();
  const { notificationList } = notificationStore
  async function getData() {
   let result  =  notificationStore.getNotification
   let data = await result(countRecord)
    if (notificationList) {
      setSkeleton(false)
      setSpinnerLoad(false)
      // if (fisrtLoad) {
      //       setSkeleton(true)
      //       if (notificationList) {
      //         setFisrtLoad(false)
      //         setSkeleton(false)
      //       } else {
      //         setSkeleton(true)
      //       }
      //     } else {
      //       setSkeleton(false)
      //       setSpinnerLoad(false)
      //     }
    }
    else {
      console.log("data notifi failt")
    }

  }
  useEffect(() => {
    getData()
    return () => {
      setSkeleton(null)
      setSpinnerLoad(null)
    }
  }, [countRecord])



  const OnRefresh = () => {
    setSkeleton(true)
    getData()
  }
  const onLoadMore = () => {
    setCountRecord(countRecord + 4)
    getData()
    setSpinnerLoad(true)

  }
  const footerComponentList = () => {
    return spinnerLoad ? <Spinner color="blue" size="xs" /> :

      <Box />
  }
  return (
    <>
      {skeleton ? (
        <Skeletonnotifi />
      ) : (


        <FlatList
          showsVerticalScrollIndicator={false}
          initialNumToRender={record}
          refreshing={false}
          onRefresh={OnRefresh}
          data={notificationList}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.1}
          keyExtractor={(item) => item._id}
          ListFooterComponent={footerComponentList}
          renderItem={({ item }) => {
            return (
              <Pressable {...rest}
                onPress={() => {
                  navigation.navigate("DetailNotificationScreen", item)
                }}
              >
                <Box  width={"95%"}
                  marginX={"auto"} p="2"  >
                  <HStack alignItems={"center"} >
                    <HStack flex={0.2}>
                      <AvatarName size="md" uri={item["sender"]["avatar"]} name={item["sender"]["name"]} />
                    </HStack>
                    <VStack flex={0.8} justifyContent={"space-between"}>
                      <HTMLView stylesheet={styles} value={`<div  >${item.summary}</div>`} />
                      <Moment
                        element={Text}
                        style={{
                          color: color.primaryend,
                        }}
                        fromNow={true}
                      >
                        {item.datetime}
                      </Moment>
                    </VStack>
                  </HStack>
                  {/* <Box flex={0.2} padding={2} alignItems={'center'} justifyContent="center"  >
                    <AvatarName size="md" uri={item["sender"]["avatar"]} name={item["sender"]["name"]} />
                  </Box>
                  <Box flex={0.8} padding={2}>
                    <HTMLView stylesheet={styles} value={`<div  >${item.summary}</br></div>`} />
                    <Moment
                      element={Text}
                      style={{
                        color: color.primaryend,
                      }}
                      fromNow={true}
                    >
                      {item.datetime}
                    </Moment>
                  </Box>
                  {item.click ? null : <Box padding={1} bg={color.primaryStart} borderRadius={5} />} */}
                </Box>
              </Pressable>
            )
          }}
        />


      )
      }
    </>
  )
})
const styles = StyleSheet.create({
  div: {
    fontWeight: '500',
    fontSize: spacing[4],
  },
});