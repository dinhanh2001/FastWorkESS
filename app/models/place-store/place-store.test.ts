import { PlaceStoreModel } from "./place-store"

test("can be created", () => {
  const instance = PlaceStoreModel.create({})

  expect(instance).toBeTruthy()
})
