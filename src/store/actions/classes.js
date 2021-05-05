import moment from 'moment';
import axios from 'axios';
import instance from '../../axios-attendance';
import * as actionTypes from './actionTypes';

export const addClassStart = () => ({
  type: actionTypes.ADD_CLASS_START,
});

export const addClassSuccess = (classId, classData) => ({
  type: actionTypes.ADD_CLASS_SUCCESS,
  classData,
  classId,
});

export const addClassFail = (error) => ({
  type: actionTypes.ADD_CLASS_FAIL,
  error,
});

export const editClassStart = () => ({
  type: actionTypes.EDIT_CLASS_START,
});

export const editClassSuccess = (classId, classData) => ({
  type: actionTypes.EDIT_CLASS_SUCCESS,
  element: classData,
  key: classId,
});

export const editClassFail = (error) => ({
  type: actionTypes.EDIT_CLASS_FAIL,
  error,
});
export const fetchClassesStart = () => ({
  type: actionTypes.FETCH_CLASSES_START,
});

export const fetchClassesSuccess = (classes) => ({
  type: actionTypes.FETCH_CLASSES_SUCCESS,
  classes,
});

export const fetchClassesFail = (error) => ({
  type: actionTypes.FETCH_CLASSES_FAIL,
  error,
});

export const attendedClassesStart = () => ({
  type: actionTypes.ATTENDED_CLASSES_START,
});

export const attendedClassesSuccess = (classes) => ({
  type: actionTypes.ATTENDED_CLASSES_SUCCESS,
  classes,
});

export const attendedClassesFail = (error) => ({
  type: actionTypes.ATTENDED_CLASSES_FAIL,
  error,
});

export const approveRejectStart = () => ({
  type: actionTypes.APPROVE_REJECT_START,
});

export const approveRejectSuccess = (classId, students) => ({
  type: actionTypes.APPROVE_REJECT_SUCCESS,
  id: classId,
  students,
});

export const approveRejectFail = () => ({
  type: actionTypes.APPROVE_REJECT_FAIL,
});

export const fetchClasses = (token, role, userId) => async (dispatch) => {
  try {
    dispatch(fetchClassesStart());
    const today = moment(new Date(), 'YYYY-MM-DD').valueOf();
    let queryParams = '';
    if (role === 'student') {
      queryParams = `?auth=${token}&orderBy="endDate"&endAt=${today}`;
    } else {
      queryParams = `?auth=${token}&orderBy="endDate"`;
    }
    const response = await instance.get(`classes.json${queryParams}`);
    const fetchedClasses = [];
    if (response.data) {
      let students = [];
      Object.keys(response.data).forEach((key) => {
        if (response.data[key].students && response.data[key].students[userId] && role !== 'teacher') {
          const user = response.data[key].students[userId];
          students = [
            {
              approved: user.approved,
              attended: user.attended,
              key: userId,
            },
          ];
        }
        fetchedClasses.push({
          ...response.data[key],
          key,
          students,
        });
      });
    }
    dispatch(fetchClassesSuccess(fetchedClasses));
    return fetchedClasses;
  } catch (error) {
    dispatch(fetchClassesFail(error));
    return error;
  }
};

export const fetchAttendedClasses = (token) => async (dispatch) => {
  try {
    dispatch(fetchClassesStart());
    const today = moment(new Date(), 'YYYY-MM-DD').valueOf();
    const queryParams = `?auth=${token}&orderBy="endDate"&endAt=${today}`;
    const response = await instance.get(`classes.json${queryParams}`);
    const users = await instance.get(`/users.json?auth=${token}`);
    const fetchedUsers = [];
    Object.keys(users.data).forEach((key) => {
      fetchedUsers.push({
        ...users.data[key],
      });
    });
    const fetchedClasses = [];
    if (response.data) {
      Object.keys(response.data).forEach((key) => {
        let students = [];
        if (response.data[key].students) {
          students = Object
            .keys(response.data[key].students)
            .reduce((result, studentId) => {
              if (response.data[key].students[studentId].attended) {
                const student = fetchedUsers.find((userData) => userData.userId === studentId);
                result.push(
                  {
                    ...response.data[key].students[studentId],
                    key: studentId,
                    fullName: student.fullName,
                  },
                );
              }
              return result;
            }, []);
        }
        fetchedClasses.push({
          endDate: response.data[key].endDate,
          startDate: response.data[key].startDate,
          name: response.data[key].name,
          students,
          key,
        });
      });
    }
    dispatch(fetchClassesSuccess(fetchedClasses));
    return fetchedClasses;
  } catch (error) {
    dispatch(fetchClassesFail(error));
    return error;
  }
};
export const addClass = (token, classData) => (dispatch) => {
  dispatch(addClassStart());
  instance.post(`/classes.json?auth=${token}`, classData)
    .then((response) => {
      console.log(response);
      dispatch(addClassSuccess(response.data.name, classData));
    })
    .catch((error) => {
      console.log(error);
      dispatch(addClassFail(error));
    });
};

export const editClass = (token, classId, classData) => (dispatch) => {
  dispatch(editClassStart());
  instance.patch(`/classes/${classId}.json?auth=${token}`, classData)
    .then((response) => {
      console.log(response);
      dispatch(editClassSuccess(classId, classData));
    })
    .catch((error) => {
      console.log(error);
      dispatch(editClassFail(error));
    });
};

export const attendedClasses = (token, userId, data) => (dispatch) => {
  dispatch(attendedClassesStart());
  const updates = data.courses.reduce((result, classData) => {
    if (classData.students && classData.students.length > 0) {
      const url = `/classes/${classData.key}/students/${userId}.json?auth=${token}`;
      const student = classData.students[0];
      result.push(
        instance.patch(url,
          {
            attended: student.attended,
          }),
      );
    }
    return result;
  }, []);
  axios.all(updates).then(axios.spread(() => {
    dispatch(attendedClassesSuccess(data.courses));
  })).catch((error) => {
    dispatch(attendedClassesFail(error));
  });
};

export const approveRejectStudents = (token, classId, students) => (dispatch) => {
  dispatch(approveRejectStart());
  const updates = students.map((student) => {
    const url = `/classes/${classId}/students/${student.key}.json?auth=${token}`;
    return instance.patch(
      url,
      {
        approved: student.approved,
      },
    );
  });
  axios.all(updates).then(axios.spread((...responses) => {
    console.log(responses);
    dispatch(approveRejectSuccess(classId, students));
  })).catch((error) => {
    dispatch(approveRejectFail(error));
  });
};
