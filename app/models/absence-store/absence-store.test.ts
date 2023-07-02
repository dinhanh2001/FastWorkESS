import { AbsenceStoreModel } from "./absence-store"

test("can be created", () => {
  const instance = AbsenceStoreModel.create({})

  expect(instance).toBeTruthy()
})
