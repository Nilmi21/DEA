import { Form, redirect } from "react-router-dom";
import { login, requireAuth } from "../api/AuthenticationApi";
import logo from "../assets/images/logo.png";

export async function loader() {
  const { loggedIn } = await requireAuth();
  if (loggedIn) {
    throw redirect("..");
  }
  return null;
}

export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const response = await login(username, password);
  const data = await response.json();
  if (response.ok) {
    sessionStorage.setItem("username", data.username);
    sessionStorage.setItem("roleDescription", data.roleDescription);
    sessionStorage.setItem("token", data.token);
    return redirect("..");
  } else {
    //error if failed
    return null;
  }
}

export default function Login() {
  return (
    <>
      <div className="login-container">
        <div className="row h-100">
          <div className="col-8 img-col"></div>
          <div className="col form-col">
            <div className="text-center">
              <img className="img-fluid logo-fix" src={logo} />
            </div>
            <Form method="post">
              <div className="mb-3 mt-5">
                <label htmlFor="username" className="form-label fw-bold">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control border-dark-subtle"
                  id="username"
                  name="username"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control border-dark-subtle"
                  id="password"
                  name="password"
                />
              </div>
              <div className="text-center mt-5 d-flex">
                <button type="submit" className="btn btn-dark w-100 fw-bold">
                  Login
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
