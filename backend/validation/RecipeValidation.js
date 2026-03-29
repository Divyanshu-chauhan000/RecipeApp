const {z} = require('zod');
 const RecipeSchemaValidation = z.object({
  title : z.string().min(1, " Title is required"),
    ingredients : z.array(z.string().min(1, 'Atleast one ingredients required')),
    instructions : z.string().min(1, "Please enter instructions"),
    imageUrl : z.string().optional()

})

module.exports = RecipeSchemaValidation