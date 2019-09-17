import {useReducer, useCallback} from "react"

const httpReducer = (currentHttpState, action) => {
switch(action.type) {
        case 'REQUEST_START':
        return {loading: true, error: null, data: null, extraArgs: null}
        case 'REQUEST_SUCCESS':
        return {...currentHttpState, loading: false, data: action.responseData, extraArgs: action.extraArgs}
        case 'REQUEST_FAIL':
        return {loading: false, error: action.error}
        case 'CLEAR_ERROR':
            return {...currentHttpState, error: null}
        default:
        throw new Error()
    }
}

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, {
        loading: false,
        error: null,
        data: null,
        extraArgs: null
    })

    const sendRequest = useCallback(async (url, method, body, extraArgs) => {

        httpDispatch({type: 'REQUEST_START'})
        try {
            const response = await fetch(url, {
              method,
              body,
              headers: {
                'Content-Type': 'application/json'
              }
            })
            const responseData = await response.json()
            /* const updatedIngredients = reducerIngredients.filter((currentIngredient) => {
              return currentIngredient.id !== ingredientId
            }) */
            /* ingredientsDispatch({type: 'DELETE', ingredientId}) */

            //setIngredients(updatedIngredients)
            //setIsLoading(false)

            /*This should invoke state update in the component that's using this hook
            because this updates the 'http state' and sets the new data property.
            If the component uses this property of the state it would cause an update too
            */
            httpDispatch({type: 'REQUEST_SUCCESS', responseData, extraArgs})
          } catch(error) {
            console.log(error)
            /* setIsLoading(false)
            setError('Something Went Wrong!') */
            httpDispatch({type: 'REQUEST_FAIL', error})
          }
    }, [])

    return {
        isLoading: httpState.loading,
        isError: httpState.error,
        data: httpState.data,
        sendRequest,
        extraArgs: httpState.extraArgs
    }
}

export default useHttp