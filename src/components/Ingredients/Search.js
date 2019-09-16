import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import {convertResponse} from '../../Utils'

const Search = React.memo(props => {
  const [searchFilter, setSearchFilter] = useState('')
  const ingredientsUrl = 'https://firestore.googleapis.com/v1/projects/react-hooks-sample-15ed6/databases/(default)/documents/ingredients'
  const {onLoadIngredients} = props
  const searchRef = useRef()
        
  /**
   * The filtering should be done on the server side
   * But being done on the client side as of now because firestore rest run query is painful
   */
  useEffect(() => {
    async function fetchData() {
      try {
        //debugger
        let loadedIngredients = []
        const response = await fetch(ingredientsUrl)
        const responseData = await response.json()
        responseData.documents.forEach((resDoc) => {
          const currentIngredient = convertResponse(resDoc)
          currentIngredient.id = resDoc.name.split(/[/ ]+/).pop()
          loadedIngredients.push(currentIngredient)
        })
        console.log("Filtered ingredients are here")
        if(searchFilter!=='')
          loadedIngredients = loadedIngredients.filter((currentIngredient) => currentIngredient.title.startsWith(searchFilter))
        onLoadIngredients(loadedIngredients)
      } catch(err) {
        console.log(err)
      }
    }

    const timer = setTimeout(() => {
      if(searchFilter===searchRef.current.value) {
        fetchData()
      }
    }, 500)

    /*
    returning is optional, but if you return something then that ought to be a function
    And it runs just before the next time the useEffect argument function runs.
    if you have an empty dependency array then it would run after the component is unmounted
    */
   return () => clearTimeout(timer)
  }, [searchFilter, onLoadIngredients, searchRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={searchRef} type="text" value={searchFilter} onChange={ev => setSearchFilter(ev.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
