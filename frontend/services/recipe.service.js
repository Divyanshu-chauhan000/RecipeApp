import api from '../api/api';


export const CreateRecipe = async (payLoad) =>{
       return api.post('/recipes/create' , payLoad)
}

export const GetRecipe = async () =>{
       return api.get('/recipes/my')
}


export const GetRecipeRating = async (id) => {
       return api.get(`/recipes/${id}`)
}

export const GetRecipeDetail = async (id) => {
       return api.get(`/recipes/${id}`)
}

export const PostRecipeRating = async (id , payLoad) => {
       return api.post(`/recipes/${id}/rate`, payLoad)
}

export const PostRecipeReview = async (id, payLoad) => {
       return api.post(`/recipes/${id}/review`, payLoad)
}
