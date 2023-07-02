import { PlaceModel } from "./place"

test("can be created", () => {
  const instance = PlaceModel.create({})

  expect(instance).toBeTruthy()
})
