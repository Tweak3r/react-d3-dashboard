import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
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

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(SignedInLinks);