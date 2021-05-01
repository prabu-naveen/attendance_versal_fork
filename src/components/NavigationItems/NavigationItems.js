import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/list" exact>Classes</NavigationItem>
    {props.role !== 'student' ? <NavigationItem link="/add">Create class</NavigationItem> : null }
    { props.role !== 'student' ? <NavigationItem link="/approve-reject">Approve/Reject attendance</NavigationItem> : null }
    <NavigationItem link="/logout">Logout</NavigationItem>
  </ul>
);

export default navigationItems;
