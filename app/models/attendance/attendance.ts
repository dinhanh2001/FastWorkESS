import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AttendanceApi } from "../../services/api/attendance-api";
import { color } from "../../theme";
import { dateYMD } from "../../utils/common";
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import { flow } from "mobx"
import * as storage from "../../utils/storage"
/**
 * Model description here for TypeScript hints.
 */
 
export const AttendanceModel = types
  .model("Attendance")
  .props({
    ozgitation:types.maybe(types.string),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({

  }))
  .actions((self)=> ({
  
  }))
  .actions((self)=>({
    setOzgitation :flow (function* (value:string) {
      self.ozgitation=value
    })
  }))
  .actions((self) => ({
    
    getDataAttendance : flow (function*  (fromDate:number,toDate:number)   {
        self.setStatus("pending");
        const dataAttendance = new AttendanceApi(self.environment.api)
        const tenantId =yield storage.load("tenantId")
        const dataAttenResult  = yield dataAttendance.getDataAttendance(tenantId,fromDate,toDate)
       let dates: {[x: string]: any} = {};
       interface StatusMonth {
        congthang?:number,
        vangmat?:number,
        dimuon?:number
      }
    
      if(dataAttenResult['kind']=== "ok"){
        if(dataAttenResult['result']['data']){
          const convert :[] = dataAttenResult['result']['data']
          let statusmonth :StatusMonth={}
          statusmonth.congthang=dataAttenResult['result']['cong_thang']
          statusmonth.vangmat = dataAttenResult['result']['so_lan_vang_mat']
          statusmonth.dimuon = dataAttenResult['result']['so_lan_di_muon']
          
            const dataConvert = convert.map((value)=>{
              return {
                id:value['id'],
                s:value['S'], // som
                m:value['M'], // muon
                date:dateYMD(value['date']),
                text:value['text'],
                state:value['state']
              }
            })
            const markedRule = (item:any)=> {
              if(item.text!=null && item.id!="" ) { // them && item.id!=""
                if(item.state ==="nghi_khong_ly_do"){ // di muon hoac ve som)
                    return {
                      marked:true,
                      dotColor: color.danger,
                      dateMarked:item.date,
                      idDay:item.id
                    } 
                } 
                else if ( item.m=="M" || item.s=="S"){
                  return {
                    marked:true,
                    dotColor: color.warning,
                    dateMarked:item.date,
                    idDay:item.id
                  }
                }
                 else { // k co
                  return {
                    marked:true,
                    dotColor: color.success,
                    dateMarked:item.date,
                    idDay:item.id
                  } 
                }
              }
              else  {
                return {}
              }
            }
            dataConvert.forEach((item)=>{
              dates[item.date] = markedRule(item)
            })
             if(dataAttenResult){
              self.setStatus("done");
              return {
                dates:dates,
                statusmonth:statusmonth
              }
             }
             else {
              self.setStatus("error")
             }
      
        }
        else {
          return {
            dates:{},
            statusmonth:{}
          }
        }
      }
      else {
        return {
          dates:{},
          statusmonth:{}
        }
      }

    }),
    getDataDay  :flow (function* ( idDay:string)  {
      interface formatDataShift {
        label?:string //dataDayResult['result']['shift'][index]['lable']
        data?:[
          timeStart?:number, //
          timeEnd?:number, // 
          chamvao?:number,
          chamra?:number
        ]
      }
       interface FormatData {
        thoigiantao?:number //dataDayResult['result']['createdDate']
        conglamviec?:number // dataDayResult['result']['cong_lam_viec']
        sophutdimuon?:number //  gioi gian di muon dataDayResult['result']['thoi_gian_di_muon']
        sophutvesom?:number //  gioi gian ve muon dataDayResult['result']['thoi_gian_ve_som']
        sogiolamthem?:number // thoi gian lam viec dataDayResult['result']['so_gio_lam_them']
        dataLoopShift?:formatDataShift[]
      }
      
      let dataResultFormat : FormatData = {}
      let dataShift :formatDataShift[]=[]
      self.setStatus("pending")
      const dataDay = new AttendanceApi(self.environment.api)
      const tenantId =yield storage.load("tenantId")
      const dataDayResult = yield dataDay.getDataDayAttendance(tenantId,idDay)
      if (dataDayResult['result']['shift'] ) {
            const shiftData:[] = dataDayResult['result']['shift'] 
       shiftData.forEach((value,index)=>{
        dataShift.push({
          label:value['label'],
          data:[
          value['checkin']=== undefined ? value['bat_dau'] : value['checkin'][0]['bat_dau'],
          value['checkin']=== undefined ? value['ket_thuc'] : value['checkin'][0]['ket_thuc'],
          value['checkin']=== undefined ? undefined : value['checkin'][0]['V']['datetime'],
          value['checkin']=== undefined ? undefined : value['checkin'][0]['R']['datetime']
        ]
        })  
        })
     dataResultFormat.dataLoopShift=dataShift
     dataResultFormat.thoigiantao = dataDayResult['result']['createdDate']
     dataResultFormat.conglamviec = dataDayResult['result']['cong_lam_viec']
     dataResultFormat.sophutdimuon = dataDayResult['result']['thoi_gian_di_muon']
     dataResultFormat.sophutvesom = dataDayResult['result']['thoi_gian_ve_som']
     dataResultFormat.sogiolamthem = dataDayResult['result']['so_gio_lam_them']

       if(dataDayResult){
        self.setStatus("done")
        return dataResultFormat
       }
       else{
        self.setStatus("error")
       }
      }
      else {
        self.setStatus("error")
       
      }
    }),
    getDataHistoryAttendance :flow ( function*(fromDate:number,toDate:number){
      interface ListDataDayMonth {
        id:string,
        date?:number,
        m?:string,
        s?:string,
        ca?:string,
        status?:string
      }
      self.setStatus("pending")
      const listDataDay = new AttendanceApi(self.environment.api)
      const listResult = yield listDataDay.getHistoryAttendance(self.ozgitation,fromDate,toDate)
      const dataconver:[] = listResult['result']['data'] 
      let dates:ListDataDayMonth[] =[]
      dataconver.forEach((item)=>{
          if(item['id']!==""){
              let value:ListDataDayMonth={
                  id:item['id'],
                  date:item['date'],
                  m:item['M'],
                  s:item['S'],
                  ca:item['ca'],
                  status:item['status']
              }
          
              dates.push(value)
          }
          
      })
      if(listResult){
        self.setStatus("done")
        return dates
      }
      else {
        self.setStatus("error")
        console.log("return data history failt")
      }

    })
    
  })) 

type AttendanceType = Instance<typeof AttendanceModel>
export interface Attendance extends AttendanceType {}
type AttendanceSnapshotType = SnapshotOut<typeof AttendanceModel>
export interface AttendanceSnapshot extends AttendanceSnapshotType {}
export const createAttendanceDefaultModel = () => types.optional(AttendanceModel, {})
