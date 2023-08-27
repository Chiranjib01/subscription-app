import "./CurrentPlan.css";

const CurrentPlan = () => {
  return (
    <div className="current-plan">
      <main>
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
      </main>
    </div>
  );
};

export default CurrentPlan;
