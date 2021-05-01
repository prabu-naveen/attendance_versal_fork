import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controls: {
        role: {
          elementType: 'select',
          elementConfig: {
            options: [
              { value: '', displayValue: 'I am a...' },
              { value: 'admin', displayValue: 'admin' },
              { value: 'teacher', displayValue: 'teacher' },
              { value: 'student', displayValue: 'student' },
            ],
          },
          value: '',
          validation: {
            required: true,
          },
          valid: false,
          label: 'Select a role',
        },
        fullName: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Full name',
          },
          value: '',
          validation: {
            required: true,
          },
          valid: false,
          touched: false,
          label: 'Full name',
        },
        email: {
          elementType: 'input',
          elementConfig: {
            type: 'email',
            placeholder: 'Mail address',
          },
          value: '',
          validation: {
            required: true,
            isEmail: true,
          },
          valid: false,
          touched: false,
          label: 'email',
        },
        password: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'Password',
          },
          value: '',
          validation: {
            required: true,
            minLength: 6,
          },
          valid: false,
          touched: false,
          label: 'password',
        },
      },
      isSignup: true,
      formIsValid: false,

    };
  }

  inputChangedHandler = (event, controlName) => {
    const { controls, isSignup } = this.state;
    const updatedControls = {
      ...controls,
      [controlName]: {
        ...controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, controls[controlName].validation),
        touched: true,
      },
    };
    let formIsValid = true;
    Object.keys(updatedControls).forEach((inputIdentifier) => {
      if (isSignup || (!isSignup && (inputIdentifier !== 'role' && inputIdentifier !== 'fullName'))) {
        formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
      }
    });
    this.setState({ controls: updatedControls, formIsValid });
  }

  submitHandler = (event) => {
    event.preventDefault();
    const { controls, isSignup } = this.state;
    const { onAuth } = this.props;
    onAuth(
      controls.email.value,
      controls.password.value,
      controls.role.value,
      controls.fullName.value,
      isSignup,
    );
  }

  switchAuthModeHandler = () => {
    this.setState((prevState) => ({ isSignup: !prevState.isSignup }));
  }

  checkValidity = (value, rules) => {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }
    return isValid;
  }

  render() {
    const { controls, isSignup, formIsValid } = this.state;
    const {
      loading, isAuthenticated, authRedirectPath, error,
    } = this.props;
    const formElementsArray = [];
    Object.keys(controls).forEach((key) => {
      if (isSignup || (!isSignup && (key !== 'role' && key !== 'fullName'))) {
        formElementsArray.push(
          {
            id: key,
            config: controls[key],
          },
        );
      }
    });
    let form = formElementsArray.map((formElement) => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        label={formElement.config.label}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
      />
    ));

    if (loading) {
      form = <Spinner />;
    }

    let errorMessage = null;
    if (error) {
      errorMessage = <p>{error.message}</p>;
    }
    let authRedirect = null;
    if (isAuthenticated) {
      authRedirect = <Redirect to={authRedirectPath} />;
    }
    return (
      <div className={classes.Auth} onSubmit={this.submitHandler}>
        {authRedirect}
        {errorMessage}
        <form>
          {form}
          <Button
            btnType="Success"
            disabled={!formIsValid}
          >
            Submit
          </Button>
        </form>
        <Button
          clicked={this.switchAuthModeHandler}
          btnType="Danger"
        >
          <span> Switch to </span>
          <span>
            { isSignup ? 'SIGNIN' : 'SIGNUP' }
          </span>
        </Button>
      </div>
    );
  }
}

Auth.defaultProps = {
  onAuth: null,
  error: null,
  isAuthenticated: false,
  loading: false,
  authRedirectPath: null,
};

Auth.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType({
    message: PropTypes.string,
    code: PropTypes.number,
  }),
  isAuthenticated: PropTypes.bool,
  onAuth: PropTypes.func,
  authRedirectPath: PropTypes.string,
};

const mapStateToProps = (state) => (
  {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirect,
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    onAuth: (email, password, role, fullName, isSignup) => dispatch(
      actions.auth(email, password, role, fullName, isSignup),
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
