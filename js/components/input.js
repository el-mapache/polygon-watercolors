import React from 'react';

class Input extends React.Component {
  handleChange() {
    
  }
  render() {
    const {
      children,
      name,
      labelText,
      value,
      type,
      ...rest
    } = this.props;

    return (
      <div>
        <label htmlFor={name}>{labelText}</label>
        <input type={type} name={name} value={value} onChange={this.handleChange} {...rest} />
        { children }
      </div>
    );
  }
}

Input.defaultProps = {
  type: 'text',
};

export default Input;