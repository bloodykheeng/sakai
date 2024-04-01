import React, { useState, useEffect } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { updateCounty } from "../../../services/county/county-service";
import { getAllDistricts } from "../../../services/districts/districts-service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProgressBar } from "primereact/progressbar";

function EditForm(props) {
    const queryClient = useQueryClient();
    const county = props.countyData;

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const validate = (values) => {
        const errors = {};

        if (!values.name) errors.name = "Please provide a valid name.";

        if (!values.districtId) errors.districtId = "Please select a District.";

        return errors;
    };

    // const onSubmitForm = (data) => {
    //     setPendingData(data);
    //     setShowConfirmDialog(true);
    // };

    const onSubmitForm = (data) => {
        const payload = {
            ...data,
            district_id: data.districtId, // Extract only the id from the districtId field
        };

        setPendingData(payload);
        setShowConfirmDialog(true);
    };

    const onConfirm = () => {
        if (pendingData) {
            updateCountiesMutation.mutate(pendingData);
            setPendingData(null);
        }
        setShowConfirmDialog(false);
    };

    const onCancel = () => {
        setShowConfirmDialog(false);
    };

    const updateCountiesMutation = useMutation((data) => updateCounty(county.id, data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["counties"]);
            props.onClose();
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");

            console.log("error updating counties is : ", error);
        },
    });

    const { data: districtsData } = useQuery(["districts"], getAllDistricts);

    return (
        <Dialog header="County Edit Form" visible={props.show} onHide={props.onHide} style={{ width: "50vw" }}>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <p>Fill in the form below</p>
                    <FinalForm
                        initialValues={{
                            name: county.name,
                            districtId: county.district_id,
                        }}
                        validate={validate}
                        onSubmit={onSubmitForm}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
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

                                <Field name="districtId">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="districtId">District</label>
                                            <Dropdown {...input} options={[{ id: "", name: "None" }, ...districtsData?.data?.data]} optionLabel="name" optionValue="id" placeholder="Select District" />
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

                    {updateCountiesMutation.isLoading && (
                        <div className="m-2">
                            <ProgressBar mode="indeterminate" />
                        </div>
                    )}

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
                </div>
            </div>
        </Dialog>
    );
}

export default EditForm;
