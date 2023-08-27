import "./Plans.css";
import { useEffect, useState } from "react";
import { monthlyPlans, yearlyPlans } from "../../utils/plans";
import PaymentForm from "../PaymentForm/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLIC_KEY } from "../../utils/constants";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Plans = () => {
  const [next, setNext] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true);
  const [plans, setPlans] = useState(monthlyPlans);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  useEffect(() => {
    if (!isMonthly) setFactor(10);
  }, []);

  return (
    <>
      {next ? (
        <Elements stripe={stripePromise}>
          <PaymentForm plan={selectedPlan} />
        </Elements>
      ) : (
        <div className="plans">
          {plans ? (
            <main>
              <h3>Choose the right plan for you</h3>
              <section className="container">
                <div className="plan-header">
                  <div className="select">
                    <div
                      className={isMonthly ? "select-active" : ""}
                      onClick={() => {
                        setIsMonthly(true);
                        setPlans(monthlyPlans);
                      }}
                    >
                      Monthly
                    </div>
                    <div
                      className={isMonthly ? "" : "select-active"}
                      onClick={() => {
                        setIsMonthly(false);
                        setPlans(yearlyPlans);
                      }}
                    >
                      Yearly
                    </div>
                  </div>
                  <div className="plan-header-item">Monthly price</div>
                  <hr />
                  <div className="plan-header-item">Video quality</div>
                  <hr />
                  <div className="plan-header-item">Resolution</div>
                  <hr />
                  <div className="plan-header-item">
                    Devices you can use to watch
                  </div>
                </div>
                {plans.map((plan) => (
                  <div className="plan-item" key={plan.name}>
                    <div
                      className={`box ${
                        plan.name == selectedPlan.name ? "box-active" : ""
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {plan.name}
                    </div>
                    <div
                      className={`plan ${
                        plan.name == selectedPlan.name ? "active-plan" : ""
                      }`}
                    >
                      <div>&#8377; {Number(plan.price)}</div>
                      <hr />
                      <div>{plan.videoQuality}</div>
                      <hr />
                      <div>{plan.resolution}</div>
                      <hr />
                      <div>
                        {plan.devices.map((device) => (
                          <li key={device}>{device}</li>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </section>
              <div className="btn-container">
                <button type="button" onClick={() => setNext(true)}>
                  Next
                </button>
              </div>
            </main>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      )}
    </>
  );
};

export default Plans;
