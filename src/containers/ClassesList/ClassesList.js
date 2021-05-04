import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import classes from './ClassesList.module.css';
import * as actions from '../../store/actions/index';
import Attendance from '../../components/Attendance/Attendance';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux';
import { updateObjectInArray } from '../../Utils/utility';

export class ClassesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: props.courses,
    };
  }

  async componentDidMount() {
    const {
      onFetchClasses,
      token,
      role,
      userId,
    } = this.props;
    const courses = await onFetchClasses(token, role, userId);
    this.setState({
      courses,
    });
  }

  handleAttendedChange = (checked, index) => {
    const { courses } = { ...this.state };
    const { userId } = this.props;
    const course = { ...courses[index] };
    let students = [];
    if (course.students.length > 0) {
      students = updateObjectInArray(
        course.students,
        {
          key: userId,
          element: { attended: checked },
        },
      );
    } else {
      students.push({
        attended: checked,
        key: userId,
      });
    }
    course.students = students;
    courses[index] = course;
    this.setState({
      courses,
    });
  }

  acceptAttendedClasses = () => {
    const { onAttendedClasses, token, userId } = this.props;
    const courses = this.state;
    onAttendedClasses(token, userId, courses);
  }

  editClass = (key) => {
    const { history } = this.props;
    history.push({
      pathname: '/edit',
      search: `?key=${key}`,
    });
  }

  render() {
    const { loading, role } = this.props;
    const { courses } = this.state;
    let header;
    if (role === 'student') {
      header = (
        <div className={classes.Header}>
          <div className={classes.Label}>Subject</div>
          <div className={classes.Label}>End Date</div>
          <div className={classes.Label}>Attended</div>
          <div className={classes.Label}>Approved</div>
        </div>
      );
    }
    if (role === 'teacher') {
      header = (
        <div className={classes.Header}>
          <div className={classes.Label}>Subject</div>
          <div className={classes.Label}>End Date</div>
          <div className={classes.Label} />
        </div>
      );
    }
    if (role === 'admin') {
      header = (
        <div className={classes.Header}>
          <div className={classes.Label}>Subject</div>
          <div className={classes.Label}>End Date</div>
          <div className={classes.Label}>Attended</div>
          <div className={classes.Label}>Approved</div>
          <div className={classes.Label} />
        </div>
      );
    }

    let attendanceList = (
      <Aux>
        <div className={classes.Header}>
          { header }
        </div>
        { courses
          .map((classData, index) => (
            <Attendance
              key={classData.key}
              label={classData.name}
              endDate={classData.endDate}
              attended={classData.students && classData.students[0]
                ? classData.students[0].attended : false}
              approved={classData.students && classData.students[0]
                ? classData.students[0].approved : false}
              role={role}
              attendedChange={(checked) => this.handleAttendedChange(checked, index)}
              clicked={() => this.editClass(classData.key)}
            />
          ))}
        { role !== 'teacher' ? (<Button btnType="Success" clicked={this.acceptAttendedClasses}>Accept</Button>) : null }
      </Aux>
    );
    if (loading) {
      attendanceList = <Spinner />;
    }
    if (courses.length === 0) {
      attendanceList = <h3>There are no classes.</h3>;
    }
    return (
      <div className={classes.List}>
        <h4>Classes</h4>
        { attendanceList }
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    courses: state.attendance.classes,
    loading: state.attendance.loading,
    token: state.auth.token,
    userId: state.auth.userId,
    role: state.auth.role,
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    onFetchClasses:
      (token, role, userId) => dispatch(actions.fetchClasses(token, role, userId)),
    onAttendedClasses: (token, userId, attendedClasses) => dispatch(
      actions.attendedClasses(token, userId, attendedClasses),
    ),
    onAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/edit')),
  }
);

ClassesList.defaultProps = {
  courses: [],
  history: {},
  onFetchClasses: null,
  onAttendedClasses: null,
  loading: false,
  token: '',
  userId: '',
  role: '',
};

ClassesList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
      startDate: PropTypes.number,
      endDate: PropTypes.number,
      students: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          attended: PropTypes.bool,
          approved: PropTypes.bool,
        }),
      ),
    }),
  ),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  loading: PropTypes.bool,
  onFetchClasses: PropTypes.func,
  onAttendedClasses: PropTypes.func,
  userId: PropTypes.string,
  token: PropTypes.string,
  role: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClassesList);
