import { Instance, SnapshotOut, SnapshotIn, types, flow, applySnapshot } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { withStatus } from "../extensions/with-Status"
import * as storage from "../../utils/storage"
import { PlaceModel } from "../place/place"
import { GetPlacesResult, PlacesApi } from "../../services/api"
/**
 * Model description here for TypeScript hints.
 */
export const PlaceStoreModel = types
  .model("PlaceStore", {
    places: types.optional(types.array(PlaceModel),[]),
    shiftSelect: types.optional(types.array(types.maybe(types.frozen({}))),[]),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .extend(withEnvironment)
  .extend(withStatus)
  .actions((self) => ({
    getPlaces: flow(function* (){
      const tenantId = yield storage.load("tenantId")
      const PlaceApi = new PlacesApi(self.environment.api)
      const placeResult: GetPlacesResult  = yield PlaceApi.getPlaces(tenantId)
      if(placeResult['kind'] =='ok' && placeResult){
        applySnapshot(self.places, placeResult['result'])
        applySnapshot(self.shiftSelect, placeResult['result'])
        self.setStatus("done")
        // console.log("getSnapshot",getSnapshot(self))
      }
      else{
        self.setStatus("error")
        console.log("placeResult", placeResult);
      }
    })
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PlaceStore extends Instance<typeof PlaceStoreModel> {}
export interface PlaceStoreSnapshotOut extends SnapshotOut<typeof PlaceStoreModel> {}
export interface PlaceStoreSnapshotIn extends SnapshotIn<typeof PlaceStoreModel> {}
export const createPlaceStoreDefaultModel = () => types.optional(PlaceStoreModel, {})
