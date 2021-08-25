import React, { useState } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setAlert } from "../../actions/alert";
import { registerUser } from "../../actions/auth";

const Register = ({ registerUser, setAlert }) => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });

  /**
   *
   * @param {Event} e
   */
  const onChange = (e) => {
    e.preventDefault();
    if (e.target.name) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  /**
   *
   * @param {Event} e
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    const { password } = formData;
    console.log(password);
    if (password.length < 5) {
      setAlert("Password must be longer than 6 characters", "danger");
    }
    const newUser = formData;
    registerUser(newUser);
  };

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="name"
            // required
            value={formData.name}
            onChange={(e) => onChange(e)}
          />
        </div>
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
    </>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, registerUser })(Register);
