import "./PaymentForm.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/constants";

const PaymentForm = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { userInfo } = useSelector((state) => state.auth);

  const createSubscription = async () => {
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement("card"),
      });
      const resp = await fetch(`${API_URL}/api/products/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          priceId: plan.price_id,
          paymentMethod: paymentMethod.paymentMethod.id,
        }),
      });
      if (!resp.ok) {
        toast.error("Payment Unsuccesfull");
        return;
      }
      const data = await resp.json();
      const confirm = await stripe.confirmCardPayment(data.clientSecret);
      if (confirm.error) {
        toast.error("Payment Unsuccesfull");
        return;
      }
      toast.success("Subscription Added");
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="payment-form">
      <div className="container">
        <section className="section-1">
          <h3>Complete Payment</h3>
          <div className="text">
            Enter your credit or debit card details below
          </div>
          <div className="card-container">
            <CardElement />
          </div>
          <div className="btn-container">
            <button type="button" onClick={createSubscription}>
              Confirm Payment
            </button>
          </div>
        </section>
        <section className="section-2">
          <h4>Order Summary</h4>
          <div className="content">
            <div className="item">
              <span>Plane Name</span>
              <span>{plan.name}</span>
            </div>
            <hr />
            <div className="item">
              <span>Billing Cycle</span>
              <span>{plan.billingCycle}</span>
            </div>
            <hr />
            <div className="item">
              <span>Plan Price</span>
              <span>&#8377; {plan.priceText}</span>
            </div>
            <hr />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentForm;
