import React from 'react';
import classes from './Toolbar.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = (props) => (
  <header className={classes.Toolbar}>
    <nav className={classes.DesktopOnly}>
      <NavigationItems role={props.role} />
    </nav>
  </header>
);

export default toolbar;
