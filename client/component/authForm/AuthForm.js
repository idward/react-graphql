import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';

class AuthForm extends Component {
  renderComponent = ({label, fieldType, input}) => {
    return (
      <div>
        <label>{label}</label>
        <input type={fieldType} {...input} autoComplete='false'/>
      </div>
    );
  }

  onSubmit = (values) => {
    this.props.onSubmit(values);
    this.props.reset();
  }

  render() {
    const {handleSubmit,errors} = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field name='email' fieldType='text' component={this.renderComponent} label='Email'/>
          <Field name='password' fieldType='password' component={this.renderComponent} label='Password'/>
          {errors.length !== 0 && (
            errors.map((errorMessage,index) => <div className='errorMessage' key={index}>{errorMessage}</div>)
          )}
          <button type='submit' className='btn'>{this.props.btnName}</button>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'AuthForm'
})(AuthForm);