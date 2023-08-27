import { useSelector } from "react-redux";
import "./CurrentPlan.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrayToString from "../../utils/arrayToString";
import moment from "moment";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/constants";
import { setCredentials, setState } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

const CurrentPlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [currentPlan, setCurrentPlan] = useState(userInfo.subscription);
  var expiryDate = new Date(moment(userInfo.updatedAt).format("MMM DD YYYY"));

  const cancelSubscription = async () => {
    try {
      const resp = await fetch(`${API_URL}/api/products/unsubscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stripeId: userInfo.stripeId,
          subscriptionId: currentPlan.id,
        }),
      });
      if (!resp.ok) {
        toast.error("Error Occured", { autoClose: 1000 });
        return;
      }
      const data = await resp.json();
      if (localStorage.getItem("userInfo")) {
        dispatch(setCredentials(data.user));
      } else {
        dispatch(setState(data.user));
      }
      setCurrentPlan({ ...currentPlan, active: false });
      toast.success("Subscripton Cancelled", { autoClose: 1000 });
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    if (!userInfo) navigate("/login");
    if (userInfo.subscription) {
      setCurrentPlan(userInfo.subscription);
      if (currentPlan.billingCycle == "monthly") {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }
    }
  }, [userInfo]);

  return (
    <div className="current-plan">
      {currentPlan ? (
        <main>
          <div className="plan-details">
            <div className="head">
              <div>
                Current Plan Details
                <span className={currentPlan?.active ? "" : "red"}>
                  {currentPlan?.active ? "Active" : "Cancelled"}
                </span>
              </div>
              {currentPlan?.active && (
                <div className="cancel" onClick={cancelSubscription}>
                  Cancel
                </div>
              )}
            </div>
            <div className="desc">
              <div className="plan-name">{currentPlan.name}</div>
              <div className="devices">
                {arrayToString(currentPlan.devices)}
              </div>
              <h4 className="price">&#8377; {currentPlan.priceText}</h4>
              <button
                className="change-plan"
                onClick={() => navigate("/choose-plan")}
              >
                Change Plan
              </button>
              {currentPlan?.active ? (
                <div className="plan-expiry">
                  Your subscription has started on{" "}
                  {moment(userInfo.updatedAt).format("MMM Do, YYYY")} and will
                  auto renew on {moment(expiryDate).format("MMM Do, YYYY")}
                </div>
              ) : (
                <div className="plan-expiry">
                  Your subscription was cancelled and you will loose access to
                  services on {moment(expiryDate).format("MMM Do, YYYY")}
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        <div className="not-selected">
          <div style={{ color: "white", fontSize: "18px" }}>
            You Don&rsquo;t Have An Active Plan
          </div>
          <div>
            <Link to="/choose-plan">Choose One</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPlan;
