import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { postCounty } from "../../../services/county/county-service";
import { getAllDistricts } from "../../../services/districts/districts-service";
import { toast } from "react-toastify";
import { ProgressBar } from "primereact/progressbar";

function CountyForm({ onClose, ...props }) {
    const queryClient = useQueryClient();

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const getListOfDistricts = useQuery(["districts"], getAllDistricts);

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Name is required";
        if (!values.districtId) errors.districtId = "District is required";

        return errors;
    };

    const createCountiesMutation = useMutation((data) => postCounty(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["counties"]);
            onClose();
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");

            console.log("error creating counties is : ", error);
        },
    });

    // const onSubmitForm = (data) => {
    //     setPendingData(data);
    //     setShowConfirmDialog(true);
    // };

    const onSubmitForm = (data) => {
        const payload = {
            ...data,
            district_id: data.districtId.id, // Extract only the id from the districtId field
        };

        setPendingData(payload);
        setShowConfirmDialog(true);
    };

    const onConfirm = () => {
        if (pendingData) {
            createCountiesMutation.mutate(pendingData);
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    const onCancel = () => {
        setShowConfirmDialog(false);
    };

    return (
        <>
            <Dialog header="Counties Form" visible={props.show} style={{ width: "50vw" }} onHide={() => props.onHide()}>
                <div className="card p-fluid">
                    <Form
                        onSubmit={onSubmitForm}
                        validate={validate}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    onSubmitForm(values);
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

                                <Field name="districtId">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="districtId">District</label>
                                            <Dropdown {...input} options={getListOfDistricts?.data?.data?.data} optionLabel="name" placeholder="Select a District" />
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
                    {createCountiesMutation.isLoading && (
                        <center>
                            <ProgressBar className="m-2" mode="indeterminate" />
                        </center>
                    )}
                </div>
            </Dialog>
        </>
    );
}

export default CountyForm;
