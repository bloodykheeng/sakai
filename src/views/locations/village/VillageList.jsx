import moment from "moment";
import React, { useState } from "react";
import { deleteVillageById, getAllVillage } from "../../../services/village/village-service";
import VillageForm from "./VillageForm";
import EditForm from "./EditForm";
import MuiTable from "../../../components/general_components/MuiTable";
import WaterIsLoading from "../../../components/general_components/WaterIsLoading";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

import { Panel } from "primereact/panel";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function VillageList({ selectedParish }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedItem, setSelectedItem] = useState({ id: null });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
    };

    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    const getListOfVillages = useQuery(["villages", selectedParish?.id], () => (!selectedParish?.id ? getAllVillage() : getAllVillage({ parish_id: selectedParish?.id })));

    const deleteVillagesMutation = useMutation(deleteVillageById, {
        onSuccess: (data) => {
            toast.success("Record Deleted Successfully");
            queryClient.invalidateQueries(["villages"]);
            setLoading(false);
        },
        onError: (error) => {
            // Show some error toast or message if required
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            setLoading(false);
        },
    });

    const handleDelete = (event, id) => {
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                setLoading(true);
                deleteVillagesMutation.mutate(id);
            },
        });
    };

    let tableId = 0;
    const columns = [
        {
            title: "#",
            field: "name",
            width: "5%",
            render: (rowData) => {
                tableId = rowData.tableData.id;
                tableId++;
                return <div>{rowData.tableData.id}</div>;
            },
        },
        {
            title: "Village Name",
            field: "name",
        },
        {
            title: "Parish Name",
            field: "parish.name",
        },
        {
            title: "Date",
            field: "created_at",
            render: (rowData) => moment(rowData.created_at).format("lll"),
        },
    ];

    return (
        <div>
            <Panel header="Villages" style={{ marginBottom: "20px" }}>
                {selectedParish && (
                    <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end" }}>
                        <Button label="Add Village" onClick={() => setShowAddForm(true)} />
                        <VillageForm selectedParish={selectedParish} show={showAddForm} onHide={() => setShowAddForm(false)} onClose={() => setShowAddForm(false)} />
                    </div>
                )}
                <MuiTable
                    tableTitle="Villages"
                    tableData={getListOfVillages?.data?.data?.data}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={handleDelete}
                    showEdit={selectedParish ? true : false}
                    showDelete={true}
                    // handleViewPage={(rowData) => {
                    //     navigate("village", { state: { villageData: rowData } });
                    // }}
                    // showViewPage={true}
                    // hideRowViewPage={false}
                    loading={loading || getListOfVillages.isLoading || deleteVillagesMutation.isLoading}
                />
                {/* //village */}
                {/* <ConfirmDialog /> */}
                <EditForm selectedParish={selectedParish} villageData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />
                {(loading || getListOfVillages.isLoading || deleteVillagesMutation.isLoading) && <WaterIsLoading />}
            </Panel>
        </div>
    );
}

export default VillageList;
