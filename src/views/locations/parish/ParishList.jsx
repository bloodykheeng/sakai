import moment from "moment";
import React, { useState } from "react";

import { deleteParishById, getAllParish } from "../../../services/parish/parish-service";
import ParishForm from "./ParishForm";
import EditForm from "./EditForm";
import MuiTable from "../../../components/general_components/MuiTable";
import WaterIsLoading from "../../../components/general_components/WaterIsLoading";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Link } from "react-router-dom";

import { Panel } from "primereact/panel";
import { toast } from "react-toastify";

function ParishList({ selectedSubCounty }) {
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

    const getListOfParishes = useQuery(["parishes", selectedSubCounty?.id], () => (!selectedSubCounty?.id ? getAllParish() : getAllParish({ sub_county_id: selectedSubCounty?.id })), {
        onSuccess: (data) => {},
        onError: (error) => {
            console.log("Error fetching parishes : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
        },
    });
    console.log("getListOfParishes : ", getListOfParishes?.data?.data?.data);
    const deleteParishesMutation = useMutation(deleteParishById, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["parishes"]);
            setLoading(false);
        },
        onError: (error) => {
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
                deleteParishesMutation.mutate(id);
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
                let tableId = rowData.tableData.id;
                tableId++;
                return <div>{tableId}</div>;
            },
        },
        ...(!selectedSubCounty
            ? [
                  {
                      title: "Name",
                      cellStyle: {
                          whiteSpace: "nowrap",
                          padding: "8px",
                      },
                      field: "name",
                      // Render as plain text if selectedSubCounty is true
                  },
              ]
            : [
                  {
                      title: "Name",
                      cellStyle: {
                          whiteSpace: "nowrap",
                          padding: "8px",
                      },
                      field: "name",
                      // Render as a link if selectedSubCounty is false
                      render: (rowData) => {
                          return (
                              <Link to="villages" state={{ selectedParish: rowData }} className="text-decoration-none">
                                  {rowData.name}
                              </Link>
                          );
                      },
                  },
              ]),
        {
            title: "Sub County Name",
            field: "sub_county.name",
        },
        {
            title: "Date",
            field: "created_at",
            render: (rowData) => moment(rowData.created_at).format("lll"),
        },
    ];

    return (
        <div>
            <Panel header="Parishes" style={{ marginBottom: "20px" }}>
                {selectedSubCounty && (
                    <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end" }}>
                        <Button label="Add Parish" onClick={() => setShowAddForm(true)} />
                        <ParishForm selectedSubCounty={selectedSubCounty} show={showAddForm} onHide={() => setShowAddForm(false)} onClose={() => setShowAddForm(false)} />
                    </div>
                )}

                <MuiTable
                    tableTitle="Parish"
                    tableData={getListOfParishes?.data?.data?.data}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={handleDelete}
                    showEdit={selectedSubCounty ? true : false}
                    showDelete={true}
                    loading={loading || getListOfParishes.isLoading || deleteParishesMutation.isLoading}
                />
                {/* <ConfirmDialog /> */}
                <EditForm selectedSubCounty={selectedSubCounty} parishData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />
                {(loading || getListOfParishes.isLoading || deleteParishesMutation.isLoading) && <WaterIsLoading />}
            </Panel>
        </div>
    );
}

export default ParishList;
