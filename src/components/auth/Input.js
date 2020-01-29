import React from 'react';

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

export default Input;
