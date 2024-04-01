import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Form, Field } from "react-final-form";
import { postSubcounty } from "../../../services/subcounty/subcounty-service";
import { getAllCounty } from "../../../services/county/county-service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import { ProgressBar } from "primereact/progressbar";
import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";

function SubcountyForm(props) {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [filteredCounties, setFilteredCounties] = useState([]);
    console.log("filteredCounties : ", filteredCounties);

    const validate = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Please provide a valid name.";
        if (!values.countyId) errors.countyId = "Please select a County.";
        return errors;
    };
    //selectedCounty;
    const getListOfCounties = useQuery(["counties", props?.selectedCounty?.district_id], () => (props?.selectedCounty?.district_id ? getAllCounty({ district_id: props?.selectedCounty?.district_id }) : getAllCounty()), {
        onSuccess: (data) => {},
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            console.log("error counties : ", error);
        },
    });

    const createSubCountiesMutation = useMutation((data) => postSubcounty(data), {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["subcounties"]);
            setLoading(false);
            props.onClose();
        },
        onError: (err) => {
            setLoading(false);
        },
    });

    const onSubmit = async (values) => {
        console.log("values on submit : ", values);
        confirmDialog({
            message: "Do you want to submit this record?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                const item = {
                    name: values.name,
                    county_id: values.countyId.id,
                };
                createSubCountiesMutation.mutate(item);
            },
            reject: () => {
                // If rejected
            },
        });
    };

    console.log("getListOfCounties.data?.data?.data : ", getListOfCounties.data?.data?.data);
    return (
        <Dialog header="Subcounty Form" visible={props.show} onHide={props.onClose} style={{ width: "50vw" }} modal={true} closable={true}>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <Form onSubmit={onSubmit} validate={validate}>
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="p-fluid m-4">
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
                                        <Button type="submit" label="Submit" />
                                    </div>
                                </div>
                            </form>
                        )}
                    </Form>
                    {createSubCountiesMutation?.isloading && <ProgressBar mode="indeterminate" />}
                </div>
            </div>
        </Dialog>
    );
}

export default SubcountyForm;
