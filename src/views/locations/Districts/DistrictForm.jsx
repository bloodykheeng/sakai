import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { postDistricts } from "../../../services/districts/districts-service";
import { toast } from "react-toastify";

function DistrictForm(props) {
    const queryClient = useQueryClient();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const createDistrictsMutation = useMutation(postDistricts, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["districts"]);
            data?.data?.message ? toast.success(data?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            console.log("success creating districts is : ", data);
            // props.onClose();
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");

            console.log("error creating districts is : ", error);
        },
    });

    const validate = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Name is required";
        return errors;
    };

    const onSubmitForm = (data) => {
        setPendingData(data);
        setShowConfirmDialog(true);
    };

    const onConfirm = () => {
        if (pendingData) {
            createDistrictsMutation.mutate(pendingData);
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    const onCancel = () => {
        setShowConfirmDialog(false);
    };

    return (
        <Dialog header="Districts Form" visible={props.show} style={{ width: "50vw" }} onHide={() => props.onHide()}>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <Form
                        onSubmit={onSubmitForm}
                        validate={validate}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="name">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="name">Name</label>
                                            <InputText {...input} id="name" type="text" />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>

                                <div className="d-grid gap-2">
                                    <Button type="submit" label="Save" className="p-button-primary" icon="pi pi-check" />
                                </div>
                            </form>
                        )}
                    />
                    <Dialog
                        header="Confirmation"
                        visible={showConfirmDialog}
                        style={{ width: "30vw" }}
                        onHide={onCancel}
                        footer={
                            <div>
                                <Button label="Yes" onClick={onConfirm} />
                                <Button label="No" onClick={onCancel} className="p-button-secondary" />
                            </div>
                        }
                    >
                        Are you sure you want to submit?
                    </Dialog>
                    {createDistrictsMutation.isLoading && (
                        <div className="m-2">
                            <ProgressBar mode="indeterminate" />
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}

export default DistrictForm;
