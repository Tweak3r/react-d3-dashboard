import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { signOut } from '../../store/actions/authActions';

const SignedInLinks = (props) => {
  const { firstName, lastName } = props.profile;
  return (
    <ul className="right">
      <li><a onClick={props.signOut}>Log Out</a></li>
      <li>
        <NavLink to="/" className="btn btn-floating orange lighten-1">
         { (firstName && lastName) ? firstName[0] + lastName[0] : '' }
        </NavLink>
      </li>
    </ul>
  )
}

SignedInLinks.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }),
  signOut: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(SignedInLinks);