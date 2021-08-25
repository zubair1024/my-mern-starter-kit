import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { logoutUser } from "../../actions/auth";

const Navbar = ({ logoutUser, auth: { isAuthenticated, loading } }) => {
  const authLinks = (
    <ul>
      {isAuthenticated && (
        <li>
          <button onClick={logoutUser}>logoutUser</button>
        </li>
      )}
    </ul>
  );

  const guestLinks = (
    <ul>
      <Link to="/register">
        <li>Register</li>
      </Link>
      <Link to="/login">
        <li>Login</li>
      </Link>
    </ul>
  );

  return (
    <div>
      <nav>{isAuthenticated ? authLinks : guestLinks}</nav>
    </div>
  );
};

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
