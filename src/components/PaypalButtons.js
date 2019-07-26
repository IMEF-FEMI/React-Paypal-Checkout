import React from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import Car from "../assets/img/car.jpg";
import Spinner from "./Spinner";

// const CLIENT = {
//   sandbox:
//     "",
//   production:
//     ""
// };

// const CLIENT_ID =
//   process.env.NODE_ENV === "production" ? CLIENT.production : CLIENT.sandbox;

let PayPalButton = null;
class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
      loading: true,
      paid: false
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      this.setState({ loading: false, showButtons: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const scriptJustLoaded =
      !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

    if (scriptJustLoaded) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver("react", {
          React,
          ReactDOM
        });
        this.setState({ loading: false, showButtons: true });
      }
    }
  }
  createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: +"Mercedes G-Wagon",
          amount: {
            currency_code: "USD",
            value: 200
          }
        }
      ]
    });
  };

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      };
      console.log("Payment Approved: ", paymentData);
      this.setState({ showButtons: false, paid: true });
    });
  };

  render() {
    const { showButtons, loading, paid } = this.state;

    return (
      <div className="main">
        {loading && <Spinner />}

        {showButtons && (
          <div>
            <div>
              <h2>Items: Mercedes G-Wagon</h2>
              <h2>Total checkout Amount $200</h2>
            </div>

            <PayPalButton
              createOrder={(data, actions) => this.createOrder(data, actions)}
              onApprove={(data, actions) => this.onApprove(data, actions)}
            />
          </div>
        )}

        {paid && (
          <div className="main">
            <img alt="Mercedes G-Wagon" src={Car} />
            <h2>
              Congrats! you just paid for that picture. Work a little harder and
              you'll be able to afford the car itself{" "}
              <span role="img" aria-label="emoji">
                {" "}
                😉
              </span>
            </h2>
          </div>
        )}
      </div>
    );
  }
}

export default scriptLoader(
  `https://www.paypal.com/sdk/js?client-id=AZ42Vzic_sZc6kiyVvrsvORgD81cQkRSIVryHtvqCNmq7z3pSZSiHWyCeIf0Ls2ZCLlfSCNS3EKlSLiy`
)(PaypalButton);
// export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`)(PaypalButton);
