import * as React from "react"
import { ScrollView } from "react-native"
import { observer } from "mobx-react-lite"
import { Calendar } from "../../calendar/calendar"
import { useStores } from "../../../models"
import { dateDMYH, dateSetHoursMinutes } from "../../../utils/common"
import { dateYMD, startOfMonth, endOfMonth, dateDMYStr } from "../../../utils/common"
import { Box } from "native-base"
import { BoxNoDataCalendar } from "../box-no-data-calendar/box-no-data-calendar"
import moment from "moment"
import { spacing } from "../../../theme/spacing"
import { LocaleConfig } from 'react-native-calendars';
import { ItemCalendar } from "../item-calendar/item-calendar"
import { Spinner } from "../../spinner/spinner"
export interface AttendanceProps {

  handleData(data: any): void
}

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ],
  monthNamesShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: "Hôm nay",

};
LocaleConfig.defaultLocale = 'vi';
export const CalendarAttendance = observer(function CalendarAttendance(props: AttendanceProps) {
  const { handleData } = props
  const { attendanceStore } = useStores();
  const [initialDate, setInittialDate] = React.useState(dateYMD(new Date().getTime()))
  const [dataCalendar, setDataCalendar] = React.useState<any>();
  const [dataDay, setDataDay] = React.useState({});
  const [idDay, setIdDay] = React.useState<string>('');
  const [checkData, setCheckData] = React.useState(false)
  const [daySelect, setDaySelect] = React.useState(dateYMD(new Date().getTime()))

  const OndayPress = (day) => {
    setDaySelect(day['dateString'])
    const idDay = dataCalendar?.[`${day.dateString}`]?.['idDay']
    if (idDay === undefined) {
      setCheckData(false)
      setIdDay('')
    }
    else {
      setIdDay(idDay)
    }
  }
  const onMonthChange = async (month) => {
    const dateStartMonth = moment(month.dateString).startOf('month').format("YYYY-MM-DD")
    setDaySelect(dateStartMonth)
    setInittialDate(month.dateString)
    const start = startOfMonth(month.dateString)
    const end = endOfMonth(month.dateString)
    const getFirstDayDataMonth = async (dateStart: number, dateEnd: number) => {
      let data = attendanceStore.getDataAttendance
      let result = await data(dateStart, dateEnd)
      if (result) {
        handleData(data['statusmonth'])
        if (data['dates'][`${dateStartMonth}`]['idDay'] === undefined) {
          setCheckData(false)
          return ""
        }
        else {
          let firtday = data['dates'][`${dateStartMonth}`]['idDay']
          let result = await attendanceStore.getDataDay(firtday)
          if (result) {
            setDataDay(result)
            setCheckData(true)
          }
          else {
            setCheckData(false)
          }

        }
      }
      else {
        setCheckData(false)
      }

      // .then(data => {
      //       handleData(data.statusmonth)
      //       if (data['dates'][`${dateStartMonth}`]['idDay'] === undefined) {
      //         setCheckData(false)
      //         return ""
      //       }
      //       else {
      //         return data['dates'][`${dateStartMonth}`]['idDay']

      //       }
      //     }
      //     )
      //       .then(data => {
      //         if (data) {
      //           const getDataFisrtday = async () => {
      //             await attendanceStore.getDataDay(data).then(dataResult => {
      //               setDataDay(dataResult)
      //               setCheckData(true)
      //             })
      //           }
      //           getDataFisrtday()
      //         }
      //         else {

      //           console.log("data ::",data)
      //           setCheckData(false)
      //         }
      //       })
      //       .catch(() => {
      //         setCheckData(false)
      //       })
      //   }
      getFirstDayDataMonth(start, end)
    }
  }
  React.useEffect(() => {

    const start = startOfMonth(initialDate)
    const end = endOfMonth(initialDate)
    const GetDataCalendar = async (dateStart: number, dateEnd: number) => {
      const result = attendanceStore.getDataAttendance
      const data = await result(start, end)
      if (data) {
        setDataCalendar(data['dates'])
        handleData(data.statusmonth)
        if (Object.keys(data.dates).length > 0) {
          //  setIdDay(data['dates'][`${initialDate}`]['idDay'])
          if (data['dates'][`${initialDate}`]['idDay']) {
            setIdDay(data['dates'][`${initialDate}`]['idDay'])
          }
          else {
            setIdDay("")
          }
        }
        else {
          console.log("falti")
          setIdDay("")
        }
      }
      else {
        setCheckData(false)
      }
    }
    GetDataCalendar(start, end)
    return () => {
      setIdDay(null)
    }
  }, [initialDate])

  React.useEffect(() => {
    const GetDataDay = async () => {
      if (idDay === "") { }
      else {
        const dataDay = await attendanceStore.getDataDay(idDay)
        if (dataDay) {
          setDataDay(dataDay)
          setCheckData(true)
        }
      }
    }

    GetDataDay()
    return () => {
      setDataDay(null)
      setCheckData(null)
    }
  }, [idDay])

  return (
    <Box marginTop={5} marginBottom={150}>
      <ScrollView >
        <Calendar
          theme={{
            todayTextColor: "blue",
            textDayFontSize: 18,
            textSectionTitleColor: "black",
            textDayFontWeight: "400",
            textSectionTitleDisabledColor: 'red',
            textDisabledColor: "blue",
          }}
          monthFormat={'MMM-yyyy'}
          allowSelectionOutOfRange={true}
          firstDay={1}
          onMonthChange={onMonthChange}
          onDayPress={OndayPress}
          markedDates={{ ...dataCalendar, [daySelect]: { selected: true, disableTouchEvent: true, selectedColor: '#3288f2' } }}
          enableSwipeMonths={true}
          displayLoadingIndicator={true}
          current={initialDate}
          hideExtraDays={true}
          disabledDaysIndexes={[6]}
        />
        {checkData ?
          (attendanceStore.getStatus() === "pending" ? <Spinner color="red" /> :

            <Box margin={"5%"} borderRadius={5} justifyContent="space-around">
              <ItemCalendar value={`${dateDMYStr(daySelect)}`} tx="attendanceScreen.date" fontSize={spacing[5]} fontWeight={"bold"} paddingBottom={1} />
              <ItemCalendar value={`${dataDay['conglamviec']}`} tx="attendanceScreen.worknumber" />
              <ItemCalendar value={`${dataDay['sophutdimuon']}`} tx="attendanceScreen.minuteslate" />
              <ItemCalendar value={`${dataDay['sophutvesom']}`} tx="attendanceScreen.minutesealry" />
              <ItemCalendar value={`${dataDay['sogiolamthem']}`} tx="attendanceScreen.overtimehours" />
              {
                dataDay['dataLoopShift'].map((value, index) => {
                  return (
                    <Box key={`${index}`}>
                      {
                        value['label'] === undefined ? <Box /> :
                          <ItemCalendar value={`${dateSetHoursMinutes(value['data'][0])} - ${dateSetHoursMinutes(value['data'][1])}`} keymain={`${value['label']}`} fontWeight={"bold"} paddingBottom={1} fontSize={spacing[5]} />
                      }
                      {
                        value['data'][2] === undefined ?
                          <Box />
                          :
                          <Box >
                            <ItemCalendar value={`${dateDMYH(value['data'][2])}`} tx="attendanceScreen.timekeepingon" />
                          </Box>
                      }
                      {

                        value['data'][3] === undefined ? <Box /> :
                          <ItemCalendar value={`${dateDMYH(value['data'][3])}`} tx="attendanceScreen.timekeepingout" />
                      }
                    </Box>
                  )
                })
              }
            </Box>)
          : <BoxNoDataCalendar />}
      </ScrollView>
    </Box>
  )
})
