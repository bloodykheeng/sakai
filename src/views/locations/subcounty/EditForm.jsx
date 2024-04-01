import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { updateSubcounty } from "../../../services/subcounty/subcounty-service";
import { getAllCounty } from "../../../services/county/county-service";
import { toast } from "react-toastify";

function EditForm(props) {
    const queryClient = useQueryClient();
    const [filteredCounties, setFilteredCounties] = useState([]);

    const getListOfCounties = useQuery(["counties", props?.selectedCounty?.district_id], () => (props?.selectedCounty?.district_id ? getAllCounty({ district_id: props?.selectedCounty?.district_id }) : getAllCounty()), {
        onSuccess: (data) => {},
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            console.log("error counties : ", error);
        },
    });

    const updateSubCountiesMutation = useMutation((data) => updateSubcounty(props.subcountyData.id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["subcounties"]);
            toast.success("Record Upadted Successfully");
            props.onClose();
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");

            console.log("error updating districts is : ", error);
        },
    });

    const onSubmit = (values) => {
        updateSubCountiesMutation.mutate({
            name: values.name,
            county_id: values.countyId.id,
        });
    };

    const validate = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Please provide a valid name.";
        if (!values.countyId) errors.countyId = "Please select a County.";
        return errors;
    };
    const [suggestions, setSuggestions] = useState([]);

    return (
        <Dialog header="Subcounty Edit Form" visible={props.show} onHide={props.onClose} style={{ width: "50vw" }} modal={true} closable={true}>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <p>Fill in the form below</p>
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        initialValues={{
                            name: props.subcountyData.name,
                            countyId: props.subcountyData.county,
                        }}
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
                                <Field name="countyId">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="county">County</label>
                                            <AutoComplete
                                                {...input}
                                                suggestions={filteredCounties}
                                                completeMethod={(e) => {
                                                    console.log("Complete method called with query:", e.query);

                                                    const results = getListOfCounties.data?.data?.data.filter((county) => {
                                                        return county.name.toLowerCase().startsWith(e.query.toLowerCase());
                                                    });
                                                    console.log("Filtered results:", results);
                                                    setFilteredCounties(results);
                                                }}
                                                // onClear={() => setFilteredCounties(getListOfCounties.data?.data?.data)} // Reset filteredCounties on clear
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
                    {(getListOfCounties.isLoading || updateSubCountiesMutation.isLoading) && (
                        <center>
                            <ProgressBar className="m-2" mode="indeterminate" />
                        </center>
                    )}
                </div>
            </div>
        </Dialog>
    );
}

export default EditForm;
