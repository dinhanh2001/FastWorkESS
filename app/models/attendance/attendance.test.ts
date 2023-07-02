import { AttendanceModel } from "./attendance"

test("can be created", () => {
  const instance = AttendanceModel.create({})

  expect(instance).toBeTruthy()
})
