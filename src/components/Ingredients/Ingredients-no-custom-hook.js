import React, {useReducer, useEffect, useCallback, useMemo} from 'react';
import ErrorModal from "../UI/ErrorModal"
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';
import {convertResponse, convertToPostBody} from '../../Utils'

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

const httpReducer = (currentHttpState, action) => {
  switch(action.type) {
    case 'REQUEST_START':
      return {loading: true, error: null}
    case 'REQUEST_SUCCESS':
      return {...currentHttpState, loading: false}
    case 'REQUEST_FAIL':
      return {loading: false, error: action.error}
    case 'CLEAR_ERROR':
        return {...currentHttpState, error: null}
    default:
      throw new Error()
  }
}

function Ingredients() {
  const [ingredients, ingredientsDispatch] = useReducer(ingredientReducer, [])
  const [httpState, httpDispatch] = useReducer(httpReducer, {loading: false, error: null})
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
    console.log('USE EFFECT RENDERING!')
  })


  const addIngredientHandler = useCallback(async ingredient => {
    //setIsLoading(true)
    httpDispatch({type: 'REQUEST_START'})
    const postBody = convertToPostBody(ingredient)
    try {
      const response = await fetch(ingredientsUrl, {
        method: 'POST',
        body: JSON.stringify(postBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const responseData = await response.json()
      //setIsLoading(false)
      httpDispatch({type: 'REQUEST_SUCCESS'})
      const ingredientId = responseData.name.split(/[/ ]+/).pop()
      const addedIngredient = convertResponse(responseData)
      //setIngredients((prevIngredients) => [...prevIngredients, {id: ingredientId, ...addedIngredient}])
      ingredientsDispatch({type: 'ADD', ingredient: {id: ingredientId, ...addedIngredient}})
    } catch(error) {
      console.log(error)
      /* setIsLoading(false)
      setError('Something Went Wrong!') */
      httpDispatch({type: 'REQUEST_FAIL', error})
    }
  }, [])

  const removeIngredientHandler = useCallback(async ingredientId => {
    //setIsLoading(true)
    httpDispatch({type: 'REQUEST_START'})
    const deleteIngredientUrl = `https://firestore.googleapis.com/v1/projects/react-hooks-sample-15ed6/databases/(default)/documents/ingredients/${ingredientId}`
    try {
      const response = await fetch(deleteIngredientUrl, {
        method: 'DELETE'
      })
      /* const updatedIngredients = reducerIngredients.filter((currentIngredient) => {
        return currentIngredient.id !== ingredientId
      }) */
      ingredientsDispatch({type: 'DELETE', ingredientId})
      //setIngredients(updatedIngredients)
      //setIsLoading(false)
      httpDispatch({type: 'REQUEST_SUCCESS'})
    } catch(error) {
      console.log(error)
      /* setIsLoading(false)
      setError('Something Went Wrong!') */
      httpDispatch({type: 'REQUEST_FAIL', error})
    }
  }, [])

  const filterIngredientHandler = useCallback(filteredIngredients => {
    //setIngredients(filteredIngredients)
    ingredientsDispatch({type: 'SET', ingredients:filteredIngredients})
  }, [])

  const resetError = () => httpDispatch({type: 'CLEAR_ERROR'})

  const ingredientList = useMemo(() => {
    return (<IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>) 
  }, [ingredients])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={resetError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.isLoading}/>
      <section>
        <Search onLoadIngredients={filterIngredientHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
