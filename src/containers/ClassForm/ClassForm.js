import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import * as actions from '../../store/actions/index';

import classes from './ClassForm.module.css';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as utilities from '../../Utils/utility';

class ClassForm extends Component {
  initialState = {
    classForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Subject',
        },
        label: 'Subject',
        value: '',
        validation: {
          required: true,
        },
        validationError: '',
        valid: false,
        touched: false,
      },
      startDate: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Start date (MM/DD/YYYY)',
        },
        label: 'Start date',
        value: '',
        validation: {
          required: true,
          minLength: 10,
          maxLength: 10,
          date: true,
        },
        validationError: '',
        valid: false,
        touched: false,
      },
      endDate: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'End date (MM/DD/YYYY)',
        },
        label: 'End date',
        value: '',
        validation: {
          required: true,
          minLength: 10,
          maxLength: 10,
          date: true,
        },
        validationError: '',
        valid: false,
        touched: false,
      },
    },
    formIsValid: false,
  };

  constructor(props) {
    super(props);
    const { location, courses } = this.props;
    const query = new URLSearchParams(location.search);
    this.classId = query.get('key');
    if (this.classId && courses.length > 0) {
      const course = courses.find((data) => data.key === this.classId);
      this.initialState.classForm.name.value = course.name;
      this.initialState.classForm.name.valid = true;
      this.initialState.classForm.startDate.value = moment(course.startDate).format('MM/DD/YYYY');
      this.initialState.classForm.startDate.valid = true;
      this.initialState.classForm.endDate.value = moment(course.endDate).format('MM/DD/YYYY');
      this.initialState.classForm.endDate.valid = true;
      this.initialState.formIsValid = true;
    }
    this.state = this.initialState;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const { classForm } = this.state;
    const classFormUpdated = { ...classForm };
    const validity = this.checkValidity(
      inputIdentifier, event.target.value, classFormUpdated[inputIdentifier].validation,
    );
    const updatedFormElement = utilities.updateObject(
      classFormUpdated[inputIdentifier],
      {
        value: event.target.value,
        touched: true,
        valid: validity.isValid,
        validationError: validity.validationError,
      },
    );
    classFormUpdated[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    Object.keys(classFormUpdated).forEach((key) => {
      formIsValid = classFormUpdated[key].valid && formIsValid;
    });
    this.setState({
      classForm: classFormUpdated,
      formIsValid,
    });
  }

  formHandler = (event) => {
    event.preventDefault();
    const { classForm } = this.state;
    const { name, startDate, endDate } = classForm;
    const classData = {
      name: name.value,
      startDate: moment(startDate.value, 'MM/DD/YYYY').valueOf(),
      endDate: moment(endDate.value, 'MM/DD/YYYY').valueOf(),
    };
    if (this.classId) {
      const { ondEditClass, token } = this.props;
      ondEditClass(token, this.classId, classData);
    } else {
      const { onAddClass, token } = this.props;
      onAddClass(token, classData);
      this.setState(this.initialState);
    }
  }

  checkValidity = (inputIdentifier, value, rules) => {
    let validationError = '';
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
      validationError = !isValid ? `Please input your ${inputIdentifier}!` : '';
    }
    if (rules.minLength && isValid) {
      isValid = value.length >= rules.minLength;
      validationError = !isValid ? `Min length required ${rules.minLength}!` : '';
    }
    if (rules.maxLength && isValid) {
      isValid = value.length <= rules.maxLength;
      validationError = !isValid ? `Max length required ${rules.maxLength}!` : '';
    }
    if (rules.date && isValid) {
      isValid = moment(value, 'MM/DD/YYYY', true).isValid();
      validationError = !isValid ? 'Date incorrect' : '';
    }
    return { isValid, validationError };
  }

  render() {
    const formElementsArray = [];
    const { classForm } = this.state;
    const { loading, courses } = this.props;
    Object.keys(classForm).forEach((key) => {
      formElementsArray.push({
        id: key,
        config: classForm[key],
      });
    });
    const { formIsValid } = this.state;
    let form = null;
    form = (
      <form onSubmit={this.formHandler}>
        {formElementsArray.map((formElement) => (
          <Input
            key={formElement.id}
            label={formElement.config.label}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            validationError={formElement.config.validationError}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <div style={{ textAlign: 'center' }}>
          <Button
            btnType="Success"
            disabled={!formIsValid}
          >
            { this.classId ? 'Update' : 'Create' }
          </Button>
        </div>
      </form>
    );
    if (loading) {
      form = <Spinner />;
    }
    if (this.classId && courses.length === 0) {
      form = <Redirect to="/" />;
    }
    return (
      <div className={classes.ClassForm}>
        <h4>{ this.classId ? 'Edit class' : 'Create class' }</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    error: state.attendance.error,
    loading: state.attendance.loading,
    courses: state.attendance.classes,
    token: state.auth.token,
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    onAddClass: (token, data) => dispatch(actions.addClass(token, data)),
    ondEditClass: (token, classId, data) => dispatch(actions.editClass(token, classId, data)),
  }
);

// Specifies the default values for props:
ClassForm.defaultProps = {
  onAddClass: null,
  ondEditClass: null,
  loading: null,
  courses: [],
  location: {},
  token: null,
};

ClassForm.propTypes = {
  onAddClass: PropTypes.func,
  ondEditClass: PropTypes.func,
  loading: PropTypes.bool,
  token: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.number,
      endDate: PropTypes.number,
    }),
  ),
};
export default connect(mapStateToProps, mapDispatchToProps)(ClassForm);
