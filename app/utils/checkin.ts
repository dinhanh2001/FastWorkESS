import NetInfo from "@react-native-community/netinfo";
import DeviceInfo from "react-native-device-info";
import { dateSetHoursMinutes } from "./common"
import { openCamera } from "./camera"
import { getDistanceFromLatLon } from "./gps";
 
export const allowCheckin = (ca: object) => {
   const currentTime = new Date().getTime()
   interface timeCheckin {
      pass?: boolean,
      timeStart?: string,
      err?: boolean
   }
   let result: timeCheckin = {}
   if(ca ==null){
      result = {pass: false, err: true}
   }else{
      if (ca['time_start_interval'] != "") {
         if (ca['isOverDay']) {
            if (dateSetHoursMinutes(currentTime) < dateSetHoursMinutes(ca['time_start_interval']) || dateSetHoursMinutes(currentTime) > dateSetHoursMinutes(0)) {
               result = {pass: true}
            } else {
               result = {pass: false, timeStart: dateSetHoursMinutes(ca['time_start_interval'])}
            }
         } else {
            if (dateSetHoursMinutes(currentTime) < dateSetHoursMinutes(ca['time_start_interval'])) {
               result = {pass: true}
            } else {
               result = {pass: false, timeStart: dateSetHoursMinutes(ca['time_start_interval'])}
            }
         }
      } else {
         result = {pass: true}
      }
   }
   console.log("thowif gian cho phep cham cong: ",result)
   return result
}

export const distance = (place: object) => {
   interface result {
      pass?: boolean,
      distance?: number,
      r?: number,
      unit?: string
   }
   let caculate: result = {}
   if (!place['visitAllow'] && place['lat'] && place['long'] && place['r']) {
      
      let distance = getDistanceFromLatLon(place['coords']['latitude'], place['coords']['longitude'], place['lat'], place['long'])
      if(distance <= place['r']){
         caculate = {pass: true, distance, r: place['r'], unit: "m" }
      }else{
         caculate = {pass: false, distance, r: place['r'], unit: "m" }
         if(distance >= 1000){
            distance = Math.round(distance / 100) / 10
            caculate = {pass: false, distance, r: place['r'], unit: "km"}  
         }
      }
   } else {
      caculate = {pass: true, r: place['r'], unit: "m" }
   }
   return caculate
}

export const network = (place: object) => {
   interface netinfoInterface {
      details ?: object,
      isConnected?: boolean,
      isInternetReachable?: boolean,
      isWifiEnabled?: boolean,
      type?: string
   }
   let netinfo: netinfoInterface = {}
   NetInfo.addEventListener(async (state) => {
      netinfo = state
    })
    interface networkResult {
      pass?: boolean,
      type?: string,
      networkAllow?: string,
      address?: string,
      name?: string
    }
   let result: networkResult = {}
   if (!place['networkType'] || (place['networkAllowIP'].length == 0 && place['networkAllow'].length == 0 ) || (place['visitNetworkAllowIP'] == "true" && place['visitNetworkAllow'])) {
      result = {pass: true}
   } else if (place['networkType'] == "IP" && place['networkAllowIP']) {
      const ipAddr = netinfo.details['ipAddress']
      const name = netinfo.details['ssid']
      const compareNetwork = place['networkAllowIP'].map((key, item: object) => {
         if(item['value'] != undefined && item['value'] == ipAddr &&
         item['label'] == name){
            return true
         }else {
            return false
         }
      })
      console.log("compareNetwork", compareNetwork)
      if (compareNetwork || place['visitNetworkAllowIP'] == "true") {
         result = {pass: true}
      } else {
         result = {
            pass: false,
            type: "IP",
            networkAllow: place['networkAllowIP'],
            address: ipAddr,
            name: netinfo.details['ssid']
         }
      }
   } else if (place['networkType'] == "MAC" && place['networkAllow']) {
      const macAddr = netinfo.details['bssid']
      const name = netinfo.details['ssid']
      const compareNetwork = place['networkAllow'].map((key, item: object) => {
         console.log(item['value'])
         if(item['value'] != undefined && item['value'].toLowerCase() == macAddr.toLowerCase() &&
         item['label'] == name){
            return true
         }else {
            return false
         }
      })
      if (compareNetwork || place['visitNetworkAllow']) {
         result = {pass: true}
      } else {
         result = {
            pass: false,
            type: "MAC",
            networkAllow: place['networkAllow'],
            address: macAddr.toLowerCase(),
            name: netinfo.details['ssid']
         }
      }
   }
   return result
}

export const picture = async (place: object) => {
   interface camera {
      pass?: boolean,
      base64?: string,
      uri?: string,
      err?: object
   }
   let result: camera = {}
   const camera = await openCamera()
   console.log("camera result: ", camera['assets'][0]['uri'])
   if (camera['assets']) {
      const base64 = camera['assets'][0]['base64']
      const uri = camera['assets'][0]['uri']
      result = {base64, pass: true, uri, err: null}
   } else {
      result = {err: camera}
   }
   return result
}

export const checkPicture = (place: object) => {
   let result = true
   if (place['visitPicture']) {
      result = false
   } else {
      result = true
   }
   return result
}

export const dataPost = (ca: object, place: object) => {
   const battery = DeviceInfo.getBatteryLevelSync()
      ? Math.round(DeviceInfo.getBatteryLevelSync() * 1000) / 10
      : null
   const lat = place['coords']['latitude']
   const long = place['coords']['longitude']
   const accuracy = place['coords']['accuracy']
   const date = place['timestamp']
   let isChonCa = false
   if (place['choiceShift']) {
      isChonCa = true
   } else {
      isChonCa = false
   }
   const dataPost = {
      lat,
      long,
      photo: "",
      retailer: {
         id: place['id'],
         address: place['address'],
         lat: place['lat'],
         long: place['long'],
         name: place['text'],
      },
      accuracy,
      extra: {
         activity: "still",
         battery: battery,
         timegps: new Date(date).toString(),
      },
      // schedule: object,
      ca,
      isChonCa,
      // verify: string
   }
   return dataPost
}
