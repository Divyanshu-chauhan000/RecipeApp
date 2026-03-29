import { GetRecipe, GetRecipeRating, PostRecipeRating } from '@/services/recipe.service'
import React, { useEffect, useState } from 'react'
import { View,Text } from 'react-native'
import StarRating from 'react-native-star-rating-widget';

const RateRecipe = ({recipeId , initialRating = 0}:{recipeId : string , initialRating : number}) => {

  const [rating , setRating] = useState<number>(initialRating);
  const [ count , setCount ] = useState(0);
  const [Loading, setLoading] = useState(false);

  useEffect(()=>{
         loadRating();
  },[recipeId])

const loadRating = async () => {
  try {
    const res = await GetRecipeRating(recipeId);
    setRating(res.data.averageRating || 0);
    setCount(res.data.ratingCount || 0);
  } catch (err) {
    console.log("Load rating error:", err);
  }
};

  const RatingHandler = async  (newRating : number)=>{
    setLoading(true)
      const finalRating = Math.round(newRating);
    setRating(finalRating)
  console.log("Sending rating:", finalRating);
     try{
      await PostRecipeRating(recipeId , {rating : finalRating})

      const { data} = await GetRecipeRating(recipeId)
      setRating(data.averageRating || newRating);
      setCount(data.ratingCount || 1)
      // console.log("Sending Rating" , newRating);
      setLoading(false);
     }catch(err: any){
       console.log("Rating Handler error:", err.response?.data || err.message);
     }
 finally {
    setLoading(false);   
  }
  }
  return (
   <View className='flex-row justify-between gap-2'>
    {Loading ? (
      <Text>Loading...</Text>
    ) : (
      <>
        <StarRating starSize={20} rating={rating} onChange={RatingHandler} enableSwiping={!Loading} />
        {count > 0 && <Text className='text-white'>{rating.toFixed(1)}/{count}</Text>}
      </>
    )}
  </View>
  )
}

export default RateRecipe
