import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import WaterIsLoading from "../../../components/general_components/WaterIsLoading";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { postVillage } from "../../../services/village/village-service";
import { getAllParish } from "../../../services/parish/parish-service";
import { AutoComplete } from "primereact/autocomplete";
import { ProgressBar } from "primereact/progressbar";
import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";

function VillageForm(props) {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(true);
    const [filteredCounties, setFilteredCounties] = useState([]);
    console.log("filteredCounties : ", filteredCounties);

    //selectedParish

    const getListOfParishes = useQuery(["parishes", props?.selectedParish?.sub_county_id], () => (props?.selectedParish?.sub_county_id ? getAllParish({ sub_county_id: props?.selectedParish?.sub_county_id }) : getAllParish()), {
        onSuccess: (data) => {},
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            console.log("error parishes : ", error);
        },
    });
    const createVillagesMutation = useMutation(postVillage, {
        onSuccess: () => {
            queryClient.invalidateQueries(["villages"]);
            setShowForm(true);
            props.onClose();
        },
        onError: (error) => {
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            setShowForm(true);
        },
    });

    const onSubmit = (values) => {
        createVillagesMutation.mutate({
            name: values.name,
            parish_id: values.parishId.id,
        });
    };

    const validate = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Please provide a valid name.";
        if (!values.parishId) errors.parishId = "Please select a Parish.";
        return errors;
    };
    return (
        <Dialog header="Village Form" visible={props.show} onHide={props.onClose} style={{ width: "50vw" }} modal={true} closable={true}>
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

                                {/* <Field name="parishId">
                                    {({ input, meta }) => (
                                        <div className="p-field m-4">
                                            <label htmlFor="parishId">Parish</label>
                                            <Dropdown {...input} id="parishId" optionLabel="name" options={getListOfParishes.data?.data} />
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
                    {(getListOfParishes.isLoading || createVillagesMutation.isLoading) && <WaterIsLoading />}
                </div>
            </div>
        </Dialog>
    );
}

export default VillageForm;
