import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { updateVillage } from "../../../services/village/village-service";
import { getAllParish } from "../../../services/parish/parish-service";
import { AutoComplete } from "primereact/autocomplete";
import { ProgressBar } from "primereact/progressbar";
import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";

function EditForm(props) {
    const queryClient = useQueryClient();
    const village = props.villageData;
    const [filteredCounties, setFilteredCounties] = useState([]);

    const [showForm, setShowForm] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [pendingData, setPendingData] = useState(null);

    const getListOfParishes = useQuery(["parishes", props?.selectedParish?.sub_county_id], () => (props?.selectedParish?.sub_county_id ? getAllParish({ sub_county_id: props?.selectedParish?.sub_county_id }) : getAllParish()), {
        onSuccess: (data) => {},
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            console.log("error parishes : ", error);
        },
    });

    const updateVillagesMutation = useMutation((data) => updateVillage(village.id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["villages"]);
            toast.success("Record Upadted Successfully");
            setShowForm(true);
            props.onClose();
        },
        onError: (error) => {
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            setShowForm(true);
        },
    });

    const validate = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Please provide a valid name.";
        if (!values.parishId) errors.parishId = "Please select a Parish.";
        return errors;
    };

    const onSubmitForm = (data) => {
        setPendingData(data);
        setShowDialog(true);
    };

    const onConfirm = () => {
        if (pendingData) {
            updateVillagesMutation.mutate({
                name: pendingData.name,
                parish_id: pendingData.parishId.id,
            });

            setPendingData(null);
        }
        setShowDialog(false);
    };

    const onCancel = () => {
        setShowDialog(false);
    };

    return (
        <>
            <Dialog visible={props.show && showForm} style={{ width: "50vw" }} header="Village Edit Form" modal={true} onHide={props.onClose}>
                <div className="col-12 md:col-12">
                    <div className="card p-fluid">
                        <p>Fill in the form below</p>
                        <Form
                            onSubmit={onSubmitForm}
                            initialValues={{
                                name: village.name,
                                parishId: village.parish,
                            }}
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
                                    {/*
                                    <Field name="parishId">
                                        {({ input, meta }) => (
                                            <div className="p-field m-4">
                                                <label htmlFor="parishId">Parish</label>
                                                <Dropdown {...input} id="parishId" options={getListOfParishes?.data?.data || []} optionLabel="name" placeholder="Select Parish" onChange={(e) => input.onChange(e.value.id)} />
                                                {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                            </div>
                                        )}
                                    </Field> */}

                                    <Field name="parishId">
                                        {({ input, meta }) => (
                                            <div className="p-field m-4">
                                                <label htmlFor="parish">Parish</label>
                                                <AutoComplete
                                                    {...input}
                                                    suggestions={filteredCounties}
                                                    completeMethod={(e) => {
                                                        console.log("Complete method called with query:", e.query);

                                                        const results = getListOfParishes.data?.data?.data.filter((parish) => {
                                                            return parish.name.toLowerCase().startsWith(e.query.toLowerCase());
                                                        });
                                                        console.log("Filtered results:", results);
                                                        setFilteredCounties(results);
                                                    }}
                                                    // onClear={() => setFilteredCounties(getListOfParishes.data?.data?.data)} // Reset filteredCounties on clear
                                                    field="name"
                                                    dropdown={true}
                                                    onChange={(e) => input.onChange(e.value)}
                                                    id="parish"
                                                />
                                                {meta.touched && meta.error && <small className="p-error">{meta.error} </small>}
                                            </div>
                                        )}
                                    </Field>

                                    <div className="d-grid gap-2">
                                        <Button type="submit" label="Save" className="p-button-primary" />
                                    </div>
                                </form>
                            )}
                        />

                        {(getListOfParishes.isLoading || updateVillagesMutation.isLoading) && (
                            <center>
                                <ProgressBar className="m-2" mode="indeterminate" />
                            </center>
                        )}
                    </div>
                </div>
            </Dialog>

            <Dialog
                header="Confirmation"
                visible={showDialog}
                onHide={onCancel}
                footer={
                    <div>
                        <Button label="Yes" onClick={onConfirm} />
                        <Button label="No" onClick={onCancel} className="p-button-secondary" />
                    </div>
                }
            >
                Are you sure you want to update?
            </Dialog>
        </>
    );
}

export default EditForm;
