import * as React from "react"
import { ScrollView } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { Text } from "../text/text"
import { Box, VStack, HStack, Pressable as PressNTB, Modal, PresenceTransition, Icon } from "native-base"
import { useState } from "react"
import { TextField } from "../text-field/text-field"
import { DatePicker } from "../date-picker/date-picker"
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { dateYMD } from "../../utils/common"
import { Pressable } from "../pressable/pressable"
import { Checkbox } from "../checkbox/checkbox"
export interface FormInfoShiftProps {
  /**
   * An optional style override useful for padding & margin.
   */
  loopfilter?: object[]
  recipients?: object[]
  onPassingApprovers(data: any): void
  onPassingRecipient(data: any): void
  desc(data: any): void
  inputDesc?: boolean
  type?:string
}
/**
 * Describe your component here
 */
export const FormInfoShift = observer(function FormInfoShift(props: FormInfoShiftProps) {
  const { loopfilter, recipients, onPassingApprovers, onPassingRecipient, desc, inputDesc ,type } = props
  const [isOpenPeople, setIsOpenPeople] = useState(false);
  const [refresh ,setRefresh] = useState(false)
  const [openRecipients, setRecipientsModal] = useState(false);
  const [recipientApi, setRecipientApi] = useState([])
  let [approvers, setApprovers] = useState([])
  

  return (
    <Box >
      <ScrollView showsVerticalScrollIndicator={false} >
        <Box p="1" w={"100%"}>
          <VStack>
            <VStack  >
              <VStack>
                <PressNTB onPress={() => setIsOpenPeople(!isOpenPeople)}>
                  <HStack bg={color.backGroundView} p="2" mb="2" justifyContent={"space-between"} alignItems="center">
                    <HStack >
                      <Text tx="absenceRequestScreen.approvedBy" fontWeight={"bold"} fontSize={spacing[4]} opacity={0.7} />
                      <Text text="*" color={color.danger} />
                    </HStack>
                    {isOpenPeople ? <MaterialIcons name="keyboard-arrow-down" size={20} color={color.primaryend} style={{ opacity: 0.7 }} /> : <MaterialIcons name="keyboard-arrow-right" size={20} color={color.primaryend} style={{ opacity: 0.7 }} />}
                  </HStack>
                </PressNTB>
                <PresenceTransition visible={isOpenPeople} initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1,
                  transition: {
                    duration: 100
                  }
                }}
                >
                  <VStack display={isOpenPeople ? "flex" : "none"} w="100%" >
                    {
                      !(typeof loopfilter == "undefined")  ?
                        loopfilter.map((element, index) => {
                          if (type =="manager" || type == "free" || typeof type=="undefined" ) {
                            return (
                              <Checkbox
                                size="md"
                                value={""}
                                key={index}
                                text={`${element['name']}( ${element['email']} )`}
                                colorScheme={'green'}
                                mb="1"
                                onChange={(value) => {
                                 
                                }}
                              />
                            )
                          } else {
                            return (
                              <Checkbox
                                defaultIsChecked={true}
                                size="md"
                                value={""}
                                key={index}
                                text={`${element['name']}( ${element['email']} )`}
                                colorScheme={'green'}
                                mb="1"
                                isDisabled={true}
                              />
                            )
                          }
                        }) : null
                    }
                  </VStack>
                </PresenceTransition>
              </VStack>
              {/* Nguoi duyet */}
              {/* <HStack bg={color.backGroundView} p="2">

                <Text tx="absenceRequestScreen.peopleNotice" fontWeight={"bold"} fontSize={spacing[4]} opacity={0.7} />
              </HStack> */}
              <PressNTB onPress={() => setRecipientsModal(!openRecipients)}>
                <HStack bg={color.backGroundView} p="2" mb="2" justifyContent={"space-between"} alignItems="center">
                  <HStack >
                    <Text tx="absenceRequestScreen.peopleNotice" fontWeight={"bold"} fontSize={spacing[4]} opacity={0.7} />
                  </HStack>
                  {openRecipients ? <MaterialIcons name="keyboard-arrow-down" size={20} color={color.primaryend} style={{ opacity: 0.7 }} /> : <MaterialIcons name="keyboard-arrow-right" size={20} color={color.primaryend} style={{ opacity: 0.7 }} />}
                </HStack>
              </PressNTB>
              <PresenceTransition visible={openRecipients} initial={{
                opacity: 0
              }} animate={{
                opacity: 1,
                transition: {
                  duration: 100
                }
              }}
              >
                <VStack mt="1" display={openRecipients ? "flex" : "none"} w="100%" >
                  {typeof recipients =="undefined" ? <Text tx="absenceRequestScreen.nonotificationrecipients" textAlign="center" />:recipients.map((element, index) => {
                    return (
                      <Checkbox
                        defaultIsChecked={false}
                        size="md"
                        value={element['email']}
                        key={index}
                        text={`${element['name']} (${element['email']}) `}
                        colorScheme={'green'}
                        mb="1"
                        onChange={(value) => {
                        
                        }}
                      />
                    )
                  }) 
                    
                  }
                </VStack>
              </PresenceTransition>

              {inputDesc ?
              <>
              <HStack bg={color.backGroundView} p="2">
                <Text tx="absenceRequestScreen.describe" fontWeight={"bold"} fontSize={spacing[4]} opacity={0.7} />
              </HStack>
                <TextField fontSize={10} multiline={true} onChangeText={(value) => { desc(value) }} pb="10" textColor="black" w={"100%"} rightElement={<Icon mr="2" as={<FontAwesome name="microphone" size={24} color="black" />} />} placeholderTx="absenceRequestScreen.content" />
                </>
                :
                  null
                  }

              {/* <Pressable tx="absenceRequestScreen.sentform" onPress={()=>{}} /> */}
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
})
