import React from 'react';
import Input from './input';

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (this.props.onInput) {
      this.props.onInput(event);
    }
  }

  render() {
    return (
      <Input
        {...this.props}
        onInput={this.handleChange}
      >
        <span>{this.props.value}</span>
      </Input>
    );
  }
}

export default NumberInput;
