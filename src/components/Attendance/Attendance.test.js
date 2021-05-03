import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Attendance from './Attendance';

configure({ adapter: new Adapter() });

describe('<Attendance />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Attendance />);
  });

  it('should render the name of the class if the user is a student', () => {
    wrapper.setProps({ role: 'student', label: 'maths' });
    expect(wrapper.find('.Label').get(0).props.children).toBe('maths');
  });

  it('should render the end date of the class if the user is a student', () => {
    wrapper.setProps({ role: 'student', endDate: new Date(100000000000) });
    expect(wrapper.find('.Label').get(1).props.children).toBe('03/03/1973');
  });

  it('should render an <input/> element if the user is a student', () => {
    wrapper.setProps({ role: 'student' });
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it('should render "Yes" when the attendance has been approved if the user is a student', () => {
    wrapper.setProps({ role: 'student', approved: true });
    expect(wrapper.find('.Label').get(3).props.children).toBe('Yes');
  });

  it('should render the name of the class if the user is a teacher', () => {
    wrapper.setProps({ role: 'teacher', label: 'maths' });
    expect(wrapper.find('.Label').get(0).props.children).toBe('maths');
  });

  it('should render the end date of the class if the user is a teacher', () => {
    wrapper.setProps({ role: 'teacher', endDate: new Date(100000000000) });
    expect(wrapper.find('.Label').get(1).props.children).toBe('03/03/1973');
  });

  it('should not render an <input/> element if the user is a teacher', () => {
    wrapper.setProps({ role: 'teacher' });
    expect(wrapper.find('input')).toHaveLength(0);
  });

  it('should render a <Button /> element if the user is a teacher', () => {
    wrapper.setProps({ role: 'teacher' });
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('should render the name of the class if the user is an admin', () => {
    wrapper.setProps({ role: 'admin', label: 'maths' });
    expect(wrapper.find('.Label').get(0).props.children).toBe('maths');
  });

  it('should render the end date of the class if the user is a admin', () => {
    wrapper.setProps({ role: 'admin', endDate: new Date(100000000000) });
    expect(wrapper.find('.Label').get(1).props.children).toBe('03/03/1973');
  });

  it('should render an <input/> element if the user is a admin', () => {
    wrapper.setProps({ role: 'admin' });
    expect(wrapper.find('input')).toHaveLength(1);
  });

  it('should render "No" when the attendance has not been approved if the user is an admin', () => {
    wrapper.setProps({ role: 'student', approved: false });
    expect(wrapper.find('.Label').get(3).props.children).toBe('No');
  });
});
