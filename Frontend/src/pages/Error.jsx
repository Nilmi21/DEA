import { Link } from "react-router-dom";

export default function Error() {
  return (
    <>
      <div className="eb">
        <div className="row h-100">
          <div className="col-md-12 align-content-center">
            <div className="error-template">
              <h1>Oops!</h1>
              <h2>404 Not Found</h2>
              <div className="error-details">
                Sorry, an error has occured, Requested page not found!
              </div>
              <div className="error-actions">
                <Link to="/" className="btn btn-primary fw-bold">
                  <span className="glyphicon glyphicon-home"></span>
                  Go Back{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
