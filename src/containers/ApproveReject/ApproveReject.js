import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import classes from './ApproveReject.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux';
import * as actions from '../../store/actions/index';
import * as utilities from '../../Utils/utility';

class ApproveReject extends Component {
  initialState = {
    approveRejectForm: {
      classes: {
        elementType: 'select',
        elementConfig: {
          options: [],
        },
        value: '',
        validation: {},
        valid: true,
        label: 'Select a class',
      },
      students: [],
    },
    formIsValid: false,
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  componentDidMount() {
    const { onFetchAttendedClasses, token } = this.props;
    onFetchAttendedClasses(token)
      .then(() => {
        const { courses } = this.props;
        const updatedApproveRejectForm = { ...this.initialState.approveRejectForm };
        const options = courses.map((course) => ({
          value: course.key,
          displayValue: course.name,
        }));
        updatedApproveRejectForm.classes.elementConfig.options = options;
        updatedApproveRejectForm.classes.value = options[0].value;
        updatedApproveRejectForm.students = this
          .getStudentsByClass(updatedApproveRejectForm.classes.value);
        this.setState({
          approveRejectForm: updatedApproveRejectForm,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  inputChangedHandler = (event) => {
    const { approveRejectForm } = this.state;
    const updatedApproveRejectForm = { ...approveRejectForm };
    updatedApproveRejectForm.classes.value = event.target.value;
    updatedApproveRejectForm.students = this
      .getStudentsByClass(updatedApproveRejectForm.classes.value);
    this.setState({
      approveRejectForm: updatedApproveRejectForm,
    });
  }

  radioChangedHandler = (event) => {
    const { approveRejectForm } = this.state;
    const updatedApproveRejectForm = { ...approveRejectForm };
    updatedApproveRejectForm.students = utilities.updateObjectInArray(
      updatedApproveRejectForm.students,
      {
        key: event.target.name,
        element: { approved: event.target.value !== 'no' },
      },
    );
    this.setState({
      approveRejectForm: updatedApproveRejectForm,
    });
  }

  getStudentsByClass = (classId) => {
    const { courses } = this.props;
    const selectedClass = courses
      .find((course) => course.key === classId);
    return selectedClass.students;
  }

  formHandler = (event) => {
    event.preventDefault();
    const { approveRejectForm } = this.state;
    const { onApproveRejectStudents, token } = this.props;
    onApproveRejectStudents(token, approveRejectForm.classes.value, approveRejectForm.students);
  }

  render() {
    const { approveRejectForm } = this.state;
    const { loading, courses } = this.props;
    const studentsList = approveRejectForm.students.map((student) => (
      <div className={classes.Header} key={student.key}>
        <div className={classes.Label}>{student.fullName}</div>
        <div className={classes.Label}>
          <input
            type="radio"
            value="yes"
            name={student.key}
            checked={student.approved === true}
            onChange={this.radioChangedHandler}
          />
        </div>
        <div className={classes.Label}>
          <input
            type="radio"
            value="no"
            name={student.key}
            checked={student.approved === false}
            onChange={this.radioChangedHandler}
          />
        </div>
      </div>
    ));
    let approveReject = (
      <Aux>
        <Input
          label={approveRejectForm.classes.label}
          elementType={approveRejectForm.classes.elementType}
          elementConfig={approveRejectForm.classes.elementConfig}
          value={approveRejectForm.classes.value}
          invalid={!approveRejectForm.classes.valid}
          shouldValidate={approveRejectForm.classes.validation}
          validationError={approveRejectForm.classes.validationError}
          touched={approveRejectForm.classes.touched}
          changed={(event) => this.inputChangedHandler(event)}
        />
        <div className={classes.Header}>
          <div className={classes.Label}>Students</div>
          <div className={classes.Label}>Approve</div>
          <div className={classes.Label}>Reject</div>
        </div>
        <form onSubmit={this.formHandler}>
          {studentsList}
          <div style={{ textAlign: 'center' }}>
            <Button
              btnType="Success"
            >
              Approve/Reject
            </Button>
          </div>
        </form>
      </Aux>
    );
    if (loading) {
      approveReject = <Spinner />;
    }
    if (courses.length === 0) {
      approveReject = <h3>There are no classes.</h3>;
    }
    return (
      <div className={classes.ApproveReject}>
        <h4>Approve/Reject attendance</h4>
        {approveReject}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    courses: state.attendance.classes,
    loading: state.attendance.loading,
    token: state.auth.token,
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    onFetchAttendedClasses: (token) => dispatch(actions.fetchAttendedClasses(token)),
    onApproveRejectStudents:
      (token, classId, students) => dispatch(
        actions.approveRejectStudents(token, classId, students),
      ),
  }
);

ApproveReject.defaultProps = {
  courses: [],
  onFetchAttendedClasses: null,
  onApproveRejectStudents: null,
  loading: false,
  token: null,
};

ApproveReject.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
      startDate: PropTypes.number,
      endDate: PropTypes.number,
      students: PropTypes.arrayOf(
        PropTypes.shape({
          approved: PropTypes.bool,
          attended: PropTypes.bool,
          fullName: PropTypes.string,
          key: PropTypes.string,
        }),
      ),
    }),
  ),
  loading: PropTypes.bool,
  onFetchAttendedClasses: PropTypes.func,
  onApproveRejectStudents: PropTypes.func,
  token: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveReject);
