import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateDistricts } from "../../../services/districts/districts-service";
import { ProgressBar } from "primereact/progressbar";
import { toast } from "react-toastify";

function EditForm(props) {
    const queryClient = useQueryClient();
    const district = props.districtData;
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const validate = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Name is required";
        return errors;
    };

    const updateDistrictsMutation = useMutation((data) => updateDistricts(district.id, data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["districts"]);
            data?.data?.message ? toast.success(data?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            console.log("success updating districts is : ", data);
            // props.onClose();
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");

            console.log("error updating districts is : ", error);
        },
    });

    const onSubmitForm = (values) => {
        setPendingData(values);
        setShowConfirmDialog(true);
    };

    const onConfirm = () => {
        if (pendingData) {
            updateDistrictsMutation.mutate(pendingData);
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    const onCancel = () => {
        setShowConfirmDialog(false);
    };

    return (
        <>
            <Dialog header="Districts Edit Form" visible={props.show} style={{ width: "50vw" }} onHide={() => props.onHide()}>
                <div className="col-12 md:col-12">
                    <div className="card p-fluid">
                        <Form
                            initialValues={{ name: district.name }}
                            validate={validate}
                            onSubmit={onSubmitForm}
                            render={({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <Field name="name">
                                        {({ input, meta }) => (
                                            <div className="p-field m-4">
                                                <label htmlFor="name">Name</label>
                                                <InputText {...input} id="name" />
                                                {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field>
                                    <div className="d-grid gap-2">
                                        <Button type="submit" label="Save" className={updateDistrictsMutation.isLoading ? "p-button-loading" : ""} />
                                    </div>
                                </form>
                            )}
                        />

                        <Dialog
                            header="Confirmation"
                            visible={showConfirmDialog}
                            onHide={onCancel}
                            footer={
                                <div>
                                    <Button label="Yes" onClick={onConfirm} />
                                    <Button label="No" onClick={onCancel} className="p-button-secondary" />
                                </div>
                            }
                        >
                            Are you sure you want to save the changes?
                        </Dialog>
                        {updateDistrictsMutation.isLoading && (
                            <div className="m-2">
                                <ProgressBar mode="indeterminate" />
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default EditForm;
