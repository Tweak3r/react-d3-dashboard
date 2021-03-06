import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signIn } from '../../store/actions/authActions';
import Input from './Input';

class SignIn extends React.Component {
  static propTypes = {
    auth: PropTypes.shape({
      uid: PropTypes.string
    }),
    authError: PropTypes.string,
    signIn: PropTypes.func
  }

  state = {
    email: '',
    password: ''
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.state);
  }

  render() {
    const { auth, authError } = this.props;
    if (auth.uid) return <Redirect to='/' />

    const inputs = [
      { name: "email", type: "email", description: "Email" },
      { name: "password", type: "password", description: "Password" }
    ];

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Sign In</h5>
          {
            inputs.map((input) => (
              <Input 
                key={input.name}
                name={input.name} 
                type={input.type}
                description={input.description}
                handleChange={this.handleChange}
              />
            ))
          }
          <div className="input-field">
            <button className="btn orange lighten-1 z-depth-0">Login</button>
            <div className="red-text center">
              { authError ? <p>{authError}</p> : null }
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (credentials) => dispatch(signIn(credentials))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
