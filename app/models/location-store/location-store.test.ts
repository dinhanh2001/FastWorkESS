import { LocationStoreModel } from "./location-store"

test("can be created", () => {
  const instance = LocationStoreModel.create({})

  expect(instance).toBeTruthy()
})
