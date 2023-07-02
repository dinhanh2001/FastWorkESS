import { OvertimeModel } from "./overtime"

test("can be created", () => {
  const instance = OvertimeModel.create({})

  expect(instance).toBeTruthy()
})
