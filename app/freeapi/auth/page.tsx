import "./auth.css";

export default function FreeApiAuthPage() {
  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <div className="auth-hero__badge">FreeAPI Auth Module</div>
        <h1>Authentication App</h1>
        <p>
          Build a full auth flow with register, login, logout, and profile
          details. All requests use session cookies for persistence.
        </p>
        <div className="auth-hero__status" aria-live="polite">
          <span className="auth-dot" aria-hidden="true"></span>
          <span id="session-status">Session: Guest</span>
        </div>
      </section>

      <div className="auth-grid">
        <section className="auth-card">
          <div className="auth-card__header">
            <h2>Access Portal</h2>
            <p>Register a new account or log in to an existing one.</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Auth forms">
            <button
              className="auth-tab is-active"
              type="button"
              data-tab="register"
              role="tab"
              aria-selected="true"
            >
              Register
            </button>
            <button
              className="auth-tab"
              type="button"
              data-tab="login"
              role="tab"
              aria-selected="false"
            >
              Login
            </button>
          </div>

          <div className="auth-forms">
            <form id="register-form" className="auth-form" data-form="register">
              <label className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Username</span>
                <input
                  type="text"
                  name="username"
                  placeholder="doejohn"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="test@123"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Role</span>
                <select name="role" defaultValue="ADMIN" required>
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
              </label>
              <button
                className="auth-button"
                id="register-submit"
                type="submit"
              >
                Create Account
              </button>
              <p className="auth-hint">
                Registration creates a new user and keeps you logged in.
              </p>
            </form>

            <form
              id="login-form"
              className="auth-form is-hidden"
              data-form="login"
            >
              <label className="auth-field">
                <span>Username</span>
                <input type="text" name="username" required />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input type="password" name="password" required />
              </label>
              <button className="auth-button" id="login-submit" type="submit">
                Sign In
              </button>
              <p className="auth-hint">
                Login uses your username + password to open a session.
              </p>
            </form>
          </div>

          <div id="auth-message" className="auth-message" role="status"></div>
        </section>

        <section className="auth-card auth-card--profile">
          <div className="auth-card__header">
            <h2>Current User</h2>
            <p>View the profile returned from the session cookie.</p>
          </div>

          <div className="auth-profile" id="user-empty">
            <p>No active session. Log in to see your profile.</p>
          </div>

          <dl className="auth-profile is-hidden" id="user-profile">
            <div>
              <dt>Username</dt>
              <dd id="profile-username">-</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd id="profile-email">-</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd id="profile-role">-</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd id="profile-id">-</dd>
            </div>
          </dl>

          <div className="auth-actions">
            <button
              className="auth-button ghost"
              id="refresh-user"
              type="button"
            >
              Refresh Profile
            </button>
            <button className="auth-button danger" id="logout" type="button">
              Logout
            </button>
          </div>
        </section>
      </div>

      <script src="/freeapi/auth/auth.js" defer></script>
    </main>
  );
}
