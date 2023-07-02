import { applySnapshot, flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { AbsenceApi } from "../../services/api/absence-api"
import { load } from "../../utils/storage"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"

/**
 * Model description here for TypeScript hints.
 */
export const AbsenceStoreModel = types
  .model("AbsenceStore")
  .props({
    absence: types.optional(types.frozen([]), []),
    members: types.optional(types.frozen([]), []),
    approvers: types.optional(types.frozen([]), []),
    number_total: types.optional(types.number, 0),
    number_absence: types.optional(types.number, 0),
    number_rest: types.optional(types.number, 0),
    recipients: types.optional(types.frozen([]), []),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .views((self) => ({}))
  .actions((self) => ({
    setShiftAbsence: (value1,value2,value3) => {
     self.absence= value1
     self.approvers=value2
     self.recipients= value3
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-varsF
  .actions((self) => ({
    filter: (approver: any, peopleApprover: number ,type?:string) => {
      let loop = []
      if(type == "manager"){ 
       if(!(typeof approver[0]['number_date'] == "undefined")){ // lenght approver=1 approver[0]approver[0] : approver[1]approver[0]
        let loopFake = approver.filter((x) => {
          return x.number_date != "none"
        })
        let element = approver.filter((x) => {
          return x.number_date == "none"
        })
        let condition = loopFake.map((value, index) => {
          return value["number_date"]
        })
        let min = Math.min(...condition)
        let max = Math.max(...condition)
        if (typeof approver === "undefined") {
          return loop
        } else {
          if (peopleApprover >= min && peopleApprover < max) {
            loopFake[0]["levels"].map((value, index) => {
              value["approvers"].map((item, index) => {
                loop.push(item)
              })
            })
          } else if (peopleApprover >= max) {
            loopFake[1]["levels"].map((value, index) => {
              value["approvers"].map((item, index) => {
                loop.push(item)
              })
            })
          } else {
            loop.push(...element[0]["approvers"])
          }

        }
        return loop
       }
       else{
        loop = approver[0]['approvers']
          return loop
       }

      }
      else if(type == "free"){
        loop = approver[0]["approvers"]
        return loop
      }
      else if(type=="level") { 
        console.log("type",type)
         approver[0]['levels'].map((value,index)=>{
            value['approvers'].map((item,id)=>{
              loop.push(item)
            })
         
        })
        return loop
      }
      else {
        loop = approver[0]['approvers']
        return loop
      }
      /* 
      truc tiep type = manager theo munberdate
      trinh tu type =  level fix cung 
      bat ky type = free danh sach chon nguoi duyet 

      if(typeof approver[0]['number_date'] == "undefined"){
          approvesr[0]['levels'].map((value,index)=>{
          loop.push(value)
         })
         return loop
       }
       else {
         //type =level ,manager return levels[0]['approves']
       }
       */
      // let loopFake = approver.filter((x) => {
      //   return x.number_date != "none"
      // })
      // let element = approver.filter((x) => {
      //   return x.number_date == "none"
      // })
      // let condition = loopFake.map((value, index) => {
      //   return value["number_date"]
      // })
      // let min = Math.min(...condition)
      // let max = Math.max(...condition)
      // if (typeof approver === "undefined") {
      //   return loop
      // } else {
      //   if (peopleApprover >= min && peopleApprover < max) {
      //     loopFake[0]["levels"].map((value, index) => {
      //       value["approvers"].map((item, index) => {
      //         loop.push(item)
      //       })
      //     })
      //   } else if (peopleApprover >= max) {
      //     loopFake[1]["levels"].map((value, index) => {
      //       value["approvers"].map((item, index) => {
      //         loop.push(item)
      //       })
      //     })
      //   } else {
      //     loop.push(...element[0]["approvers"])
      //   }
      // }
      // return loop
    },
    createAbsence: flow(function* () {
      self.setStatus("pending")
      const response = new AbsenceApi(self.environment.api)
      let tenantId = yield load("tenantId")
      const create = yield response.createAbsence(
        tenantId,
        self.absence,
        self.members,
        self.approvers,
        self.number_total,
        self.number_absence,
        self.number_rest,
        self.recipients,
      )
      if(create['result']['result']){
        return {
          result:create['result']['result'],
          active:true
        }
      }else {
        return {
          result:create['result']['message'],
          active:false
        }
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AbsenceStore extends Instance<typeof AbsenceStoreModel> {}
export interface AbsenceStoreSnapshotOut extends SnapshotOut<typeof AbsenceStoreModel> {}
export interface AbsenceStoreSnapshotIn extends SnapshotIn<typeof AbsenceStoreModel> {}
export const createAbsenceStoreDefaultModel = () => types.optional(AbsenceStoreModel, {})
