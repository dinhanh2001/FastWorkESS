import { ShiftmoreModel } from "./shiftmore"

test("can be created", () => {
  const instance = ShiftmoreModel.create({})

  expect(instance).toBeTruthy()
})
