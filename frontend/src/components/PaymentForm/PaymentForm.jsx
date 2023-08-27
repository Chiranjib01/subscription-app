import "./PaymentForm.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/constants";
import { setCredentials, setState } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
          stripeId: userInfo.stripeId,
          priceId: plan.price_id,
          paymentMethod: paymentMethod.paymentMethod.id,
          plan,
        }),
      });
      if (!resp.ok) {
        toast.error("Payment Unsuccesfull", { autoClose: 1000 });
        return;
      }
      const data = await resp.json();
      const confirm = await stripe.confirmCardPayment(data.clientSecret);
      if (confirm.error) {
        toast.error("Payment Unsuccesfull", { autoClose: 1000 });
        return;
      }
      if (localStorage.getItem("userInfo")) {
        setCredentials({ ...data.user });
      } else {
        setState({ ...data.user });
      }
      toast.success("Subscription Added", { autoClose: 1000 });
      navigate("/");
    } catch (error) {
      toast.error("Something Went Wrong", { autoClose: 1000 });
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
