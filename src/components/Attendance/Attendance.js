import React from 'react';
import moment from 'moment';
import classes from './Attendance.module.css';
import Button from '../UI/Button/Button';
import Aux from '../../hoc/Aux';

const attendance = (props) => {
  const approved = props.approved ? 'Yes' : 'No';
  let attendanceUser;
  if (props.role === 'student') {
    attendanceUser = (
      <Aux>
        <div className={classes.Label}>{props.label}</div>
        <div className={classes.Label}>{moment(props.endDate).format('MM/DD/YYYY')}</div>
        <div className={classes.Label}>
          <input
            name="attended"
            type="checkbox"
            checked={props.attended}
            onChange={(event) => props.attendedChange(event.target.checked)}
          />
        </div>
        <div className={classes.Label}>{ approved }</div>
      </Aux>
    );
  }
  if (props.role === 'teacher') {
    attendanceUser = (
      <Aux>
        <div className={classes.Label}>{props.label}</div>
        <div className={classes.Label}>{moment(props.endDate).format('MM/DD/YYYY')}</div>
        <div className={classes.Label}>
          <Button
            clicked={props.clicked}
            btnType="Success"
          >
            Edit
          </Button>
        </div>
      </Aux>
    );
  }
  if (props.role === 'admin') {
    attendanceUser = (
      <Aux>
        <div className={classes.Label}>{props.label}</div>
        <div className={classes.Label}>{moment(props.endDate).format('MM/DD/YYYY')}</div>
        <div className={classes.Label}>
          <input
            name="attended"
            type="checkbox"
            checked={props.attended}
            onChange={(event) => props.attendedChange(event.target.checked)}
          />
        </div>
        <div className={classes.Label}>{ approved }</div>
        <div className={classes.Label}>
          <Button
            clicked={props.clicked}
            btnType="Success"
          >
            Edit
          </Button>
        </div>
      </Aux>
    );
  }
  return (
    <div className={classes.Attendance}>
      { attendanceUser }
    </div>
  );
};

export default attendance;
