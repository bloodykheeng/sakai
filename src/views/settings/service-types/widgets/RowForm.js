import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { Dropdown } from "primereact/dropdown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classNames } from "primereact/utils";

import setFieldTouched from "final-form-set-field-touched";
//
import { toast } from "react-toastify";
import { AutoComplete } from "primereact/autocomplete";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileUpload } from "primereact/fileupload";

function RowForm({ handleSubmit, initialData = { name: "", description: "", fee: "" }, ...props }) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const queryClient = useQueryClient();

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";
        if (!values.description) errors.description = "Description are required";
        if (!values.fee || values.fee <= 0) {
            errors.fee = "Please provide a valid value.";
        } else {
            // Remove commas and check if the number is too large
            const numericValue = values.fee.replace(/,/g, "");
            if (numericValue.split(".")[0].length > 15) {
                errors.fee = "Fee must be less than or equal to 15 digits.";
            }
        }

        return errors;
    };

    // const onSubmitForm = (data) => {
    //     const errors = validate(data);
    //     if (Object.keys(errors).length === 0) {
    //         // No validation errors
    //         setPendingData(data);
    //         setShowConfirmDialog(true);
    //     } else {
    //         toast.warning("First Fill In All Required Fields");
    //     }
    // };
    const onSubmitForm = (data, form) => {
        const errors = validate(data);

        if (Object.keys(errors).length === 0) {
            const fee = parseFloat(data?.fee.replace(/,/g, ""));
            const formData = { ...data, fee: fee };
            setPendingData(formData);
            setShowConfirmDialog(true);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(errors).forEach((field) => {
                form.mutators.setFieldTouched(field, true);
            });

            toast.warning("Please fill in all required fields and upload a photo.");
        }
    };

    const onConfirm = () => {
        if (pendingData) {
            handleSubmit(pendingData);
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    const onCancel = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div className="col-12 md:col-12">
            <div className="card p-fluid">
                <Form
                    onSubmit={onSubmitForm}
                    initialValues={initialData}
                    mutators={{ setFieldTouched }}
                    validate={validate}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                console.log("values hhh : ", values);
                                console.log("event fffff : ", event);
                                onSubmitForm(values, form);
                                // handleSubmit(event, values);
                            }}
                        >
                            <Field name="name">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="name">Name</label>
                                        <InputText {...input} id="name" type="text" />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <Field name="description">
                                {({ input, meta }) => (
                                    <div className="p-field m-4">
                                        <label htmlFor="description">Description</label>
                                        <InputTextarea {...input} rows={5} cols={30} id="description" className={classNames({ "p-invalid": meta.touched && meta.error })} />
                                        {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                    </div>
                                )}
                            </Field>

                            <div style={{ marginBottom: "1rem" }}>
                                <Field name="fee">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="fee">Fee</label>
                                            <InputText
                                                {...input}
                                                id="fee"
                                                type="text" // Use text type to allow formatting
                                                className={classNames({ "p-invalid": meta.touched && meta.error })}
                                                value={input.value}
                                                onChange={(e) => {
                                                    const handleNumberChange = (input, value) => {
                                                        // Strip out non-numeric characters (except decimal point)
                                                        const numericValue = value.replace(/[^\d.]/g, "");

                                                        // Check the length of digits before the decimal point does not exceed 15
                                                        if (numericValue.split(".")[0].length > 15) {
                                                            // If it does, do not update the input value and potentially show a warning message
                                                            return;
                                                        }

                                                        // Convert to a number and then back to a string to remove leading zeroes
                                                        const number = numericValue ? parseFloat(numericValue).toString() : "";

                                                        // Format the number with commas for display purposes
                                                        const formattedValue = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                                        // Update the input's displayed value with formattedValue
                                                        input.onChange(formattedValue);
                                                    };
                                                    return handleNumberChange(input, e.target.value);
                                                }}
                                            />
                                            {meta.error && meta.touched && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field>
                            </div>

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
            </div>
        </div>
    );
}

export default RowForm;
