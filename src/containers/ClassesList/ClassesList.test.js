import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// eslint-disable-next-line import/no-named-as-default
import { ClassesList } from './ClassesList';
import Button from '../../components/UI/Button/Button';
import Attendance from '../../components/Attendance/Attendance';

configure({ adapter: new Adapter() });

describe('<ClassesList />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ClassesList onFetchClasses={() => Promise.resolve([{ key: '1', name: 'maths', endDate: 100000000000 }])} />);
  });

  it('should render a <Button> component when the user is a student', () => {
    wrapper.setProps({ role: 'student' });
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should render an <Attendance> component when the user is a student', () => {
    wrapper.setProps({ role: 'student' });
    expect(wrapper.find(Attendance)).toHaveLength(1);
  });

  it('should render a <Button> component when the user is an admin', () => {
    wrapper.setProps({ role: 'admin' });
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should render an <Attendance> component when the user is an admin', () => {
    wrapper.setProps({ role: 'admin' });
    expect(wrapper.find(Attendance)).toHaveLength(1);
  });

  it('should not render a <Button> component when the user is a teacher', () => {
    wrapper.setProps({ role: 'teacher' });
    expect(wrapper.find(Button)).toHaveLength(0);
  });

  it('should render an <Attendance> component when the user is a teacher', () => {
    wrapper.setProps({ role: 'teacher' });
    expect(wrapper.find(Attendance)).toHaveLength(1);
  });
});
