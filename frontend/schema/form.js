const {z} = require('zod')

export const recipeFormSchema = z.object({
  title : z.string().min(1, "Please enter title"),
 ingredients: z.array(
  z.object({
    value: z.string().min(1)
  })
),
  instructions : z.string().min(1, "Please enter instructions"),
  imageUrl : z.string().optional()
})