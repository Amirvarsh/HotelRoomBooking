import React from "react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  function Logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top">
        <a className="navbar-brand" href="/home">
          <b style={{ fontFamily: "cursive" }}>SR</b>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i class="bi bi-list" style={{ color: "white" }}></i>
          </span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-5">
            {user ? (
              <>
                <div class="dropdown">
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="bi bi-person-fill"></i> {user.name}
                  </button>
                  <div class="dropdown-menu" style={{ minWidth: "auto" }}>
                    <a class="dropdown-item" href="/profile">
                      Profile
                    </a>
                    {user.isAdmin && (
                      <a className="dropdown-item" href="/admin">
                        Admin
                      </a>
                    )}
                    <a class="dropdown-item" href="/" onClick={Logout}>
                      Logout
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <li className="nav-item active">
                  <a
                    className="nav-link"
                    href="/register"
                    style={{ fontFamily: "cursive" }}
                  >
                    Register
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/login"
                    style={{ fontFamily: "cursive" }}
                  >
                    Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
