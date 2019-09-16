import React, {useState} from 'react';
import LoadingIndicator from "../UI/LoadingIndicator"
import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  /**
   * It takes a default state as the first arg with which it is initialized. This state can be anything
   * whereas in class based state it needed to be an object as a must.
   */
  //const [inputState, setInputState] = useState({title: '', amount: ''})
  const [inputTitle, setInputTitle] = useState('')
  const [inputAmount, setInputAmount] = useState('')


  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: inputTitle, amount: inputAmount})
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={inputTitle}
              onChange={ev => setInputTitle(ev.target.value)}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={inputAmount}
                  onChange={ev => setInputAmount(ev.target.value)}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading ? <LoadingIndicator/> : null}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
