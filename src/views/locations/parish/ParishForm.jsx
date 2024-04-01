import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { postParish } from "../../../services/parish/parish-service";
import { getAllSubcounty } from "../../../services/subcounty/subcounty-service";
import { AutoComplete } from "primereact/autocomplete";
import { toast } from "react-toastify";
import { ProgressBar } from "primereact/progressbar";

function ParishForm(props) {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(true);
    const [filteredCounties, setFilteredCounties] = useState([]);

    const getListOfSubCounties = useQuery(["subcounties", props?.selectedSubCounty?.county_id], () => (props?.selectedSubCounty?.county_id ? getAllSubcounty({ county_id: props?.selectedSubCounty?.county_id }) : getAllSubcounty()), {
        onSuccess: (data) => {},
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            console.log("error counties : ", error);
        },
    });

    const createParishesMutation = useMutation(postParish, {
        onSuccess: () => {
            queryClient.invalidateQueries(["parishes"]);
            setShowForm(true);
            props.onClose();
            toast.success("Record Upadted Successfully");
        },
        onError: (error) => {
            // props.onClose();
            setShowForm(true);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");

            console.log("error updating parishes is : ", error);
        },
    });

    const onSubmit = (values) => {
        createParishesMutation.mutate({
            name: values.name,
            sub_county_id: values.subcountyId.id,
        });
    };

    const validate = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Please provide a valid name.";
        if (!values.subcountyId) errors.countyId = "Please select a Sub County.";
        return errors;
    };

    return (
        <Dialog header="Parish Form" visible={props.show} onHide={props.onClose} style={{ width: "50vw" }} modal={true} closable={true}>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <p>Fill in the form below</p>
                    <Form
                        validate={validate}
                        onSubmit={onSubmit}
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

                                {/* <Field name="subcountyId">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="subcountyId">Subcounty</label>
                                            <Dropdown {...input} id="subcountyId" optionLabel="name" options={getListOfSubCounties.data?.data} />
                                            {meta.touched && meta.error && <small className="p-error">{meta.error}</small>}
                                        </div>
                                    )}
                                </Field> */}

                                <Field name="subcountyId">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="subcountyId">Subcounty</label>
                                            <AutoComplete
                                                {...input}
                                                suggestions={filteredCounties}
                                                completeMethod={(e) => {
                                                    console.log("Complete method called with query:", e.query);

                                                    const results = getListOfSubCounties.data?.data?.data.filter((subcounty) => {
                                                        return subcounty.name.toLowerCase().startsWith(e.query.toLowerCase());
                                                    });
                                                    console.log("Filtered results:", results);
                                                    setFilteredCounties(results);
                                                }}
                                                // onClear={() => setFilteredCounties(getListOfSubCounties.data?.data?.data)} // Reset filteredCounties on clear
                                                field="name"
                                                dropdown={true}
                                                onChange={(e) => input.onChange(e.value)}
                                                id="county"
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
                    {(getListOfSubCounties.isLoading || createParishesMutation.isLoading) && (
                        <center>
                            <ProgressBar className="m-2" mode="indeterminate" />
                        </center>
                    )}
                </div>
            </div>
        </Dialog>
    );
}

export default ParishForm;
