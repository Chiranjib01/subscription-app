import { useSelector } from "react-redux";
import "./CurrentPlan.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CurrentPlan = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [currentPlan, setCurrentPlan] = useState(userInfo.subscription);
  useEffect(() => {
    if (!userInfo) navigate("/login");
    // else if (!userInfo.subscription) navigate("/choose-plan");
  }, [userInfo]);
  console.log(userInfo);
  return (
    <div className="current-plan">
      {JSON.stringify(currentPlan)}
      {/* <main>
        <div className="plan-details">
          <div className="head">
            <div>
              Current Plan Details
              <span>Active</span>
            </div>
            <div className="cancel">Cancel</div>
          </div>
          <div className="desc">
            <div className="plan-name">Basic</div>
            <div className="devices">Phone+tablet</div>
            <h4 className="price">&#8377; 2,000/yr</h4>
            <button className="change-plan">Change Plan</button>
            <div className="plan-expiry">
              Your subscription has started on Jul 11th, 2022 and will auto
              renew on Jul 12th, 2023
            </div>
          </div>
        </div>
      </main> */}
    </div>
  );
};

export default CurrentPlan;
