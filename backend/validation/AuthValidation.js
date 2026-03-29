const {z} = require("zod");

 const signUpSchema =  z.object({
    fullName : z.string().trim().min(1, "Full Name is required"),
    email: z.string().trim().email(1,"Invalid Email"),
    password: z.string().trim().min(6, 'Password must be at least 6 characters.')
})



 const LoginSchema = z.object({
    email: z.string().trim().email(1,"Invalid Email"),
    password: z.string().trim().min(6, 'Password must be at least 6 characters.')
})

module.exports = {signUpSchema , LoginSchema}