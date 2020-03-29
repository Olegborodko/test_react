import React, {Component} from 'react';
import { Form, Button } from 'react-bootstrap';
const Axios = require('axios');


class Example extends Component {
  state = {
    password: '',
    login: '',
    error: ''
  };

  componentDidMount() {
  }

  handleSubmit = (event) => {
    event.preventDefault();

    Axios.post(process.env.REACT_APP_BACKEND_HOST + '/oauth/token' , {
        "username": this.state.login,
        "password": this.state.password,
        "grant_type": "password",
        "client_id": 2,
        "client_secret": process.env.REACT_APP_CLIENT_SECRET
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {}
      })
      .then((result) => {
        if (result && result.data && result.data.access_token){
          let data = result.data;
          localStorage.setItem('token', data.access_token);
          window.location.pathname = '/products';
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 401){
          this.setState({
            error: 'wrong password or login'
          })
        } else {
          this.setState({
            error: 'server error'
          })
        }
      })
  }

  loginChange = (event) => {
    this.setState({
      login: event.target.value
    })
  }

  passwordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  render() {
    //const {} = this.props;
    const {error} = this.state;

    return (
      <div className="login-block">
        <div className="message-error">
          {error}
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control onChange={this.loginChange} type="text" placeholder="Enter username" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={this.passwordChange}
              type="password"
              autoComplete="on"
              placeholder="Password" />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}

export default Example;