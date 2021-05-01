import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layout from './components/Layout/Layout';
import Toolbar from './components/Toolbar/Toolbar';
import ClassesList from './containers/ClassesList/ClassesList';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import ClassForm from './containers/ClassForm/ClassForm';
import ApproveReject from './containers/ApproveReject/ApproveReject';
import Aux from './hoc/Aux';
import * as actions from './store/actions/index';

export class AppContainer extends Component {
  componentDidMount() {
    const { onTryAutoSignup } = this.props;
    onTryAutoSignup();
  }

  render() {
    const { isAuthenticated, role } = this.props;
    let routes = <Route path="/" exact component={Auth} />;
    if (isAuthenticated) {
      routes = (
        <Aux>
          <Toolbar role={role} />
          <Route path="/" exact component={Auth} />
          <Route path="/list" component={ClassesList} />
          <Route path="/add" component={ClassForm} />
          <Route path="/edit" component={ClassForm} />
          <Route path="/approve-reject" component={ApproveReject} />
          <Route path="/logout" component={Logout} />
        </Aux>
      );
    }
    if (role === 'student') {
      routes = (
        <Aux>
          <Toolbar role={role} />
          <Route path="/" exact component={Auth} />
          <Route path="/list" component={ClassesList} />
          <Route path="/logout" component={Logout} />
        </Aux>
      );
    }
    return (
      <div>
        <Layout>
          { routes }
        </Layout>
      </div>
    );
  }
}

AppContainer.defaultProps = {
  isAuthenticated: false,
  role: '',
  onTryAutoSignup: () => {},
};

AppContainer.propTypes = {
  isAuthenticated: PropTypes.bool,
  role: PropTypes.string,
  onTryAutoSignup: PropTypes.func,
};

const mapStateToProps = (state) => (
  {
    isAuthenticated: state.auth.token !== null,
    role: state.auth.role,
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
