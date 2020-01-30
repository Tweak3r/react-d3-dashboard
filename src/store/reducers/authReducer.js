import { 
  LOGIN_SUCCESS, 
  LOGIN_ERROR, 
  SIGNUP_SUCCESS, 
  SIGNUP_ERROR,
  SIGNOUT_SUCCESS 
} from '../constants/authConstants';

const initialState = {
    authError: null
  };
  
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_ERROR:
      return {
        ...state,
        authError: 'Login Failed'
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        authError: null
      }
    case SIGNOUT_SUCCESS:
      console.log('Logout Success');
      return state;
    case SIGNUP_SUCCESS:
      console.log('Signup Success');
      return {
        ...state,
        authError: null
      }
    case SIGNUP_ERROR:
      console.log('Signup Error');
      return {
        ...state,
        authError: action.err.message
      }
    default: 
      return state;
  }
}
  
  export default authReducer