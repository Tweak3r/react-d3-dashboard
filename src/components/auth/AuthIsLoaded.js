import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

function AuthIsLoaded({ children }) {
  const auth = useSelector(state => state.firebase.auth);
  if (!isLoaded(auth)) {
      return <div className="loader">Loading...</div>;
  }
  return children;
}

AuthIsLoaded.propTypes = {
  children: PropTypes.node.isRequired
}
  
export default AuthIsLoaded;
  