import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";

class App extends Component {
  onToken = token => {
    fetch("/charge", {
      method: "POST",
      body: JSON.stringify({
        stripeData: token,
        products: [
          {id: 42, quantity: 2},
          {id: 1337, quantity: 1}
        ]
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "succeeded") {
          console.log(data);
          // dispatch a success
        } else {
          console.warn(data);
          // dispatch an error
        }
      });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <StripeCheckout
            token={this.onToken}
            amount={999}
            currency="EUR"
            stripeKey={process.env.REACT_APP_PUBLISHABLE_KEY}
          />
        </div>
        <div className="App-intro">
          <StripeCheckout
            token={this.onToken}
            amount={999}
            currency="EUR"
            stripeKey={process.env.REACT_APP_PUBLISHABLE_KEY}
            image={logo}
            email="toto@toto.com"
            name="My Demo of Stripe"
            description="Change me into a description"
          >
            <button className="btn btn-primary">Pay with a custom button</button>
          </StripeCheckout>
        </div>
      </div>
    );
  }
}

export default App;
