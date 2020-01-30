import React from 'react';
import PropTypes from 'prop-types';

const Input = (props) => {
  const { name, type, description, handleChange } = props;
  return (
    <div>
      <div className="input-field">
        <label htmlFor={name}>{description}</label>
        <input type={type} name={name} onChange={handleChange} />
      </div>
    </div>
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default Input;
