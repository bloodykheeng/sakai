import React, { useState, useEffect } from "react";

import { getAllProductTypes, getProductTypeById, postProductType, updateProductType, deleteProductTypeById } from "../../../services/products/product-types-service";

import RowForm from "./widgets/RowForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

function EditForm(props) {
    const queryClient = useQueryClient();

    const [editMutationIsLoading, setEditMutationIsLoading] = useState(false);

    const editMutation = useMutation({
        mutationFn: (variables) => updateProductType(props?.rowData?.id, variables),
        onSuccess: () => {
            props.onClose();
            setEditMutationIsLoading(false);
            toast.success("Edited Successfully");
            queryClient.invalidateQueries(["product-types"]);
        },
        onError: (error) => {
            // props.onClose();
            setEditMutationIsLoading(false);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    // const handleSubmit = (data) => {
    //     console.log(data);

    //     editMutation.mutate(data);
    // };

    const handleSubmit = async (data) => {
        console.log("Data we are submitting: ", data);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", data.name);
        formData.append("code", data.code);
        formData.append("description", data.description);
        formData.append("status", data.status);
        formData.append("photo", data.photo); // Assuming 'photo' is the field name for the file upload

        // Log formData keys and values for debugging
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        editMutation.mutate(formData);
    };
    return (
        <Dialog header="Product Types Form" visible={props.show} style={{ width: "50vw" }} onHide={() => props.onHide()}>
            {/* <h3>Programs Edit Form</h3> */}
            <p>Edit Data Below</p>
            <RowForm initialData={props.rowData} handleSubmit={handleSubmit} />
            {/* <h4>{creactProgramsMutation.status}</h4> */}

            {editMutationIsLoading && (
                <center>
                    <ProgressSpinner
                        style={{
                            width: "50px",
                            height: "50px",
                            borderWidth: "8px", // Border thickness
                            borderColor: "blue", // Border color
                            animationDuration: "1s",
                        }}
                        strokeWidth="8"
                        animationDuration="1s"
                    />
                </center>
            )}
        </Dialog>
    );
}

export default EditForm;
