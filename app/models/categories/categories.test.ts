import { CategoriesModel } from "./categories"

test("can be created", () => {
  const instance = CategoriesModel.create({})

  expect(instance).toBeTruthy()
})
