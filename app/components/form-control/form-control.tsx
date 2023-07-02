import * as React from "react"
import { ScrollView} from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
import { Box, VStack, HStack, Icon } from "native-base"
import HTMLView from "react-native-htmlview"
import { AvatarName } from "../avatar-name/avatar-name"
import { useStores } from "../../models"
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { TextField } from "../text-field/text-field"
import { dateYMDH, dateDMY } from "../../utils/common"
export interface FormControlProps {
  /**
   * An optional style override useful for padding & margin.
   */
  data?: {
    _id: string,
    type: string
  }
}

/**
 * Describe your component here
 */
export const FormControl = observer(function FormControl(props: FormControlProps) {
  const { data } = props
  const { categoriesStore, userStore } = useStores()
  const [dataApi, setDataApi] = React.useState<object>({})
  React.useEffect(() => {
    const getData = async () => {
      const detailsShift = categoriesStore.shiftDetail
      const DataDetails = await detailsShift(data.type, data._id)
      setDataApi(DataDetails['result'])
    }
    getData()
  }, [])
  return (
    <Box >
      <ScrollView >
        <VStack pb="2" pt="2" borderBottomColor={"#ccc"} borderBottomWidth="0.5">
          <HStack px="2" >
            <HStack >
              <AvatarName uri={userStore.avatar} name={userStore.name} size="md" />
              <VStack justifyContent={"space-between"} >
                <Text text="Nguyễn Hoàng Quân" fontWeight={"bold"} fontSize={spacing[5]} />
                <HStack alignItems={"center"}>
                  {dataApi['status'] =="Chờ duyệt" ?
                  <AntDesign name="minuscircle" size={20} color={color.warning} />
                :
                  <AntDesign name="checkcircle" size={20} color={color.success} />
                }
                  <Text ml="1" text={`${dataApi['status']}`} fontWeight="700"/>
                </HStack>
              </VStack>
            </HStack>
          </HStack>
        </VStack>
        <VStack >
          <VStack mb="2" bg={color.backGroundView} p="2" >
            <Text text="Ngày nộp đơn" fontWeight={"bold"} fontSize={spacing[4]} />
          </VStack>
          <VStack p="2" >
            <Text text={`${dateYMDH(dataApi['createdDate'])}`} />
          </VStack>
        </VStack>
        <VStack >
          <VStack mb="2" bg={color.backGroundView} p="2" >
            <Text text="Ngày phê duyệt" fontWeight={"bold"} fontSize={spacing[4]} />
          </VStack>
          <VStack p="2" >
            <Text text={`${dateDMY(dataApi['modifiedDate'])}`} />
          </VStack>
        </VStack>
        <VStack >
          <VStack mb="2" bg={color.backGroundView} p="2" >
            <Text text="Thông tin đơn" fontWeight={"bold"} fontSize={spacing[4]} />
          </VStack>
        </VStack>
        <VStack >
          <VStack mb="2" bg={color.backGroundView} p="2" >
            <Text text="Người duyệt" fontWeight={"bold"} fontSize={spacing[4]} />
          </VStack>
        </VStack>
       < VStack >
          <HStack mb="2" p="2" >
           { dataApi['approvers'] ?dataApi['approvers'].map((value,index)=>{
            return (
              <Text text={`${value['name']},`}  fontSize={spacing[4]}  key={value['email']}/>
            )
           }) : <Text text="Bạn chưa chọn người duyệt" fontWeight={"bold"} fontSize={spacing[4]} />}
          </HStack>
        </VStack>
        <VStack >
          <VStack bg={color.backGroundView} p="2" >
            <Text text="Người phê duyệt" fontWeight={"bold"} fontSize={spacing[4]} />
          </VStack>
          <VStack p="2" >
            <Text text="Trưởng phòng 3" />
          </VStack>
        </VStack>
        <VStack >
          <VStack bg={color.backGroundView} p="2" >
            <Text text="Người nhận thông báo" fontWeight={"bold"} fontSize={spacing[4]} />
          </VStack>
          <VStack p="2" >
          { dataApi['recipients'] ? dataApi['recipients'].map((value,index)=>{
            return (
              <Text text={`${value['name']},`}  fontSize={spacing[4]}  key={value['email']}/>
            )
           }) : <Text text="Bạn chưa chọn người phê duyệt" fontWeight={"bold"} fontSize={spacing[4]} />}
          </VStack>
        </VStack>
        <VStack mb="20">
          <VStack bg={color.backGroundView} p="2" >
            <Text text="Bình luận" fontWeight={"bold"} fontSize={spacing[4]} />
          </VStack>
          <VStack p="2" >
            <TextField placeholderTx='absenceRequestScreen.content' pb="10" rightElement={<Icon mr="2" color={color.buttend} as={<FontAwesome name="paper-plane" size={24} />} />} />
          </VStack>
        </VStack>

      </ScrollView>
    </Box>
  )
})
