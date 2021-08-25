import React from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import { removeAlert } from "../../actions/alert";

const Alert = ({ alerts, removeAlert }) => {
  /**
   *
   * @param {Event} e
   */
  const clearAlert = (e) => {
    removeAlert(e.target.id);
  };
  return (
    <>
      <h1>Alerts</h1>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <div key={alert.id}>
            {alert.msg} - {alert.alertType}
            <button id={alert.id} onClick={clearAlert}>
              X
            </button>
          </div>
        ))}
    </>
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
  removeAlert: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps, { removeAlert })(Alert);
