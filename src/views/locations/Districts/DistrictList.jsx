import moment from "moment";
import React, { useEffect, useState } from "react";

import { deleteDistrictById, getAllDistricts } from "../../../services/districts/districts-service";
import DistrictForm from "./DistrictForm";
import EditForm from "./EditForm";
import MuiTable from "../../../components/general_components/MuiTable";
import WaterIsLoading from "../../../components/general_components/WaterIsLoading";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function DistrictList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [districts, setDistricts] = useState([]);
    const [selectedItem, setSelectedItem] = useState({ id: null });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
    };
    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    const columns = [
        {
            title: "Name",
            cellStyle: {
                whiteSpace: "nowrap",
                padding: "8px",
            },
            field: "name",
            render: (rowData) => {
                return (
                    <Link to="counties" state={{ selectedDistrict: rowData }} className="text-decoration-none">
                        {rowData.name}
                    </Link>
                );
            },
        },
        {
            title: "Date",
            field: "created_at",
            render: (rowData) => moment(rowData.created_at).format("lll"),
        },
    ];

    const getListOfDistricts = useQuery(["districts"], getAllDistricts, {
        onSuccess: (data) => {},
        onError: (error) => {
            console.log("Error fetching districts : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
        },
    });

    console.log("getListOfDistricts : ", getListOfDistricts);
    const deleteDistrictMutation = useMutation(deleteDistrictById, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["districts"]);
            setLoading(false);
        },
        onError: (error) => {
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            let message = "An error occurred!";
            setMessage(message);
            setLoading(false);
        },
    });

    const onFormClose = () => {
        setShowAddForm(false);
    };

    // const handleDelete = async (event, id) => {
    //     var result = window.confirm("Are you sure you want to delete? ");
    //     if (result === true) {
    //         setLoading(true);
    //         deleteDistrictMutation(id);
    //         setLoading(false);
    //     }
    // };

    const handleDelete = (event, id) => {
        let deleteDistrictId = id;
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => confirmDelete(deleteDistrictId),
            reject: cancelDelete,
        });
    };

    const confirmDelete = (deleteDistrictId) => {
        if (deleteDistrictId !== null) {
            deleteDistrictMutation.mutate(deleteDistrictId);
        }
    };

    const cancelDelete = () => {
        // setDeleteProgramId(null);
    };

    return (
        <div style={{ width: "100%" }}>
            <Panel header="Districts" style={{ marginBottom: "20px" }}>
                {/* <div className="d-flex justify-content-end mb-3" style={{ width: "100%" }}>
                    {activeUser?.permissions.includes("add programs") && <Button label="Add Program" className="p-button-primary right-0" onClick={() => setShowAddForm(true)} />}
                    <ProgramsCreateForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} />
                </div> */}
                <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={() => setShowAddForm(true)}>Add District</Button>

                    <DistrictForm show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} />
                </div>
                <MuiTable
                    tableTitle="Districts"
                    tableData={getListOfDistricts?.data?.data?.data}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={(e, item_id) => handleDelete(e, item_id)}
                    showEdit={true}
                    showDelete={true}
                    loading={loading || getListOfDistricts.isLoading || getListOfDistricts.status == "loading" || deleteDistrictMutation.isLoading}
                />
                {/* <ConfirmDialog />; */}
                <EditForm districtData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />
                {(loading || getListOfDistricts.isLoading || getListOfDistricts.status == "loading" || deleteDistrictMutation.isLoading) && <WaterIsLoading />}
            </Panel>
        </div>
    );
}

export default DistrictList;
