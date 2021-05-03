import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('<NavigationItems />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
  });

  it('should render two <NavigationItems /> elements if the user is a student', () => {
    wrapper.setProps({ role: 'student' });
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it('should render four <NavigationItems /> elements if the user is a teacher', () => {
    wrapper.setProps({ role: 'teacher' });
    expect(wrapper.find(NavigationItem)).toHaveLength(4);
  });

  it('should render four <NavigationItems /> elements if the user is an admin', () => {
    wrapper.setProps({ role: 'admin' });
    expect(wrapper.find(NavigationItem)).toHaveLength(4);
  });
});
