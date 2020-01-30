import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

const Navbar = (props) => {
  const { auth, profile } = props;
  const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks /> ;
  return (
      <nav className="light-blue lighten-1">
        <div className="container">
          <Link to="/" className="logo">{profile.firstName} {profile.lastName}</Link>
          {links}
        </div>
      </nav>
  )
}

Navbar.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string
  }),
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string
  })
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

export default connect(mapStateToProps)(Navbar);