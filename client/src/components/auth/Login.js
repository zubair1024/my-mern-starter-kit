import React, { useState } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { loginUser } from "../../actions/auth";

const Login = ({ loginUser, isAuthenticated }) => {
  const [formData, setFromData] = useState({
    email: "",
    password: "",
  });

  /**
   *
   * @param {Event} e
   */
  const onChange = (e) => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   *
   * @param {Event} e
   */
  const onSubmit = (e) => {
    e.preventDefault();
    loginUser({ email: formData.email, password: formData.password });
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="email"
            required
            value={formData.email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            required
            value={formData.password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div>
          <input type="submit" value="submit" />
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { loginUser })(Login);
