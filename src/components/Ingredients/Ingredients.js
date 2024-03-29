import React, {useReducer, useEffect, useCallback, useMemo} from 'react';
import ErrorModal from "../UI/ErrorModal"
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';
import {convertResponse, convertToPostBody} from '../../Utils'
import useHttp from '../../hooks/http'

//You define reducer outside so that it doesn't redefine everytime with re-render
const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET': 
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
        return currentIngredients.filter((currentIngredient) => currentIngredient.id !== action.ingredientId)
    default:
      throw new Error()
  }
}



function Ingredients() {
  const [ingredients, ingredientsDispatch] = useReducer(ingredientReducer, [])

  /**
   * Custom Hook in Use
   */
  const {isLoading, error, data, sendRequest, extraArgs} = useHttp()

  //const [stateIngredients, setIngredients] = useState([])
  //const [isLoading, setIsLoading] = useState(false)
  //const [error, setError] = useState('')

  const baseUrl = 'https://firestore.googleapis.com/v1/projects/react-hooks-sample-15ed6/databases/(default)/'
  const ingredientsUrl = baseUrl + 'documents/ingredients'

  /* useEffect is a self-contained function that runs after every render cycle by default,
   as in compdidmount & compdidupdate. If a list of depedencies are provided, then it runs only 
   when any of the dependencies changes. If an empty dependency array is provided then it runs only
   during the initial load, as in compdidmount. This is because as there's no dependency there is no change in it,
  so effectively no further change and hence no further re-run after the initial one
  */
 // Effect callbacks are synchronous to prevent race conditions. The async function should be put inside
  useEffect(() => {
    async function fetchData() {
      try {
        /* ingredientsUrl would still be available here without this re-definition 
        but react would show warning as it would be assumed to be a missing dependency */
        
        const ingredientsUrl = baseUrl + 'documents/ingredients'
        const loadedIngredients = []
        const response = await fetch(ingredientsUrl)
        const responseData = await response.json()
        responseData.documents.forEach((resDoc) => {
          const currentIngredient = convertResponse(resDoc)
          currentIngredient.id = resDoc.name.split(/[/ ]+/).pop()
          loadedIngredients.push(currentIngredient)
        })
        console.log("About to set new ingredients state")
        //setIngredients(loadedIngredients)
        ingredientsDispatch({type: 'SET', ingredients:loadedIngredients})
      } catch(err) {
        console.log(err)
      }
    }
    //Not invoking because the useEffect in search is already taking care of the initial render
    //fetchData()
  }, [])

  
  useEffect(() => {
    console.log('USE EFFECT RENDERING!', data)
    if(extraArgs) {
      ingredientsDispatch({type: 'DELETE', ingredientId: extraArgs})
    } else {
      ingredientsDispatch({type: 'ADD'/* , ingredient: {id: ingredientId, ...addedIngredient} */})
    }
  }, [data, extraArgs])


  const addIngredientHandler = useCallback(async ingredient => {
    // //setIsLoading(true)
    // httpDispatch({type: 'REQUEST_START'})
    // const postBody = convertToPostBody(ingredient)
    // try {
    //   const response = await fetch(ingredientsUrl, {
    //     method: 'POST',
    //     body: JSON.stringify(postBody),
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   })
    //   const responseData = await response.json()
    //   //setIsLoading(false)
    //   httpDispatch({type: 'REQUEST_SUCCESS'})
    //   const ingredientId = responseData.name.split(/[/ ]+/).pop()
    //   const addedIngredient = convertResponse(responseData)
    //   //setIngredients((prevIngredients) => [...prevIngredients, {id: ingredientId, ...addedIngredient}])
    //   ingredientsDispatch({type: 'ADD', ingredient: {id: ingredientId, ...addedIngredient}})
    // } catch(error) {
    //   console.log(error)
    //   /* setIsLoading(false)
    //   setError('Something Went Wrong!') */
    //   httpDispatch({type: 'REQUEST_FAIL', error})
    // }
    const ingredientsUrl = 'https://firestore.googleapis.com/v1/projects/react-hooks-sample-15ed6/databases/(default)/documents/ingredients'
    const postBody = convertToPostBody(ingredient)
    sendRequest(ingredientsUrl, 'POST', JSON.stringify(postBody))
  }, [])

  const removeIngredientHandler = useCallback(async ingredientId => {
    //setIsLoading(true)
    const deleteIngredientUrl = `https://firestore.googleapis.com/v1/projects/react-hooks-sample-15ed6/databases/(default)/documents/ingredients/${ingredientId}`
    sendRequest(deleteIngredientUrl, 'DELETE', ingredientId)
  }, [sendRequest])

  const filterIngredientHandler = useCallback(filteredIngredients => {
    //setIngredients(filteredIngredients)
    ingredientsDispatch({type: 'SET', ingredients:filteredIngredients})
  }, [])

  const resetError = () => { /* return httpDispatch({type: 'CLEAR_ERROR'}) */ }

  const ingredientList = useMemo(() => {
    return (<IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>) 
  }, [ingredients])

  return (
    <div className="App">
      {error && <ErrorModal onClose={resetError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>
      <section>
        <Search onLoadIngredients={filterIngredientHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
