import { Form } from "react-router-dom";

export default function FormModal({
  modalId,
  formId,
  title,
  buttonText,
  formContent,
  modalType,
}) {
  return (
    <>
      <div
        className="modal fade"
        id={modalId}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                {title}
              </h1>
              <button
                id={`${modalType}ModalClose`}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Form id={formId} method="post">
                {formContent}
              </Form>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                form={formId}
                className={`btn fw-bold ${
                  modalType === "delete"
                    ? "btn-danger"
                    : modalType === "edit"
                    ? "btn-secondary"
                    : "btn-dark"
                }`}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
