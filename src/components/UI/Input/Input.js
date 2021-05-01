import React from 'react';
import classes from './Input.module.css';
import Aux from '../../../hoc/Aux';

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  const { required } = props.shouldValidate;

  switch (props.elementType) {
    case ('input'):
      inputElement = (
        <Aux>
          <input className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} onChange={props.changed} />
          { props.validationError !== '' ? <div className={classes.Error}>{ props.validationError }</div> : null }
        </Aux>
      );
      break;
    case ('textarea'):
      inputElement = <textarea className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} onChange={props.changed} />;
      break;
    case ('select'):
      inputElement = (
        <select className={inputClasses.join(' ')} value={props.value} onChange={props.changed}>
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>{option.displayValue}</option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = <input className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} onChange={props.changed} />;
      break;
  }
  return (
    <div className={classes.Input}>
      <label htmlFor={props.label} className={classes.Label}>
        {props.label}
        { required ? <span>*</span> : null }
      </label>
      {inputElement}
    </div>
  );
};

export default input;
