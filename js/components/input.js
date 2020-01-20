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
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor={name} style={{ marginBottom: '.5rem', display: 'block' }}>
          <strong>{labelText}</strong>
        </label>
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