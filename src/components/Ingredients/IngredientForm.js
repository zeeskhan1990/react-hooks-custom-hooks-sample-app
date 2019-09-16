import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  /**
   * It takes a default state as the first arg with which it is initialized. This state can be anything
   * whereas in class based state it needed to be an object as a must.
   */
  const [inputState, setInputState] = useState({title: '', amount: ''})
  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={inputState.title}
              onChange={ev => {
                    //ev.persist()
                    const newTitle = ev.target.value
                    setInputState((prevInputState) => {
                      return {title: newTitle, amount: prevInputState.amount}
                    })
                  }
                }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={inputState.amount}
                  onChange={ev => {
                    //ev.persist()
                    const newAmount = ev.target.value
                    setInputState((prevInputState) => {
                      return {title: prevInputState.title, amount: newAmount}
                    })
                  }
                }/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
