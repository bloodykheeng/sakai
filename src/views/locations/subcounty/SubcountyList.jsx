import moment from "moment";
import React, { useState } from "react";
import { deleteSubcountyById, getAllSubcounty } from "../../../services/subcounty/subcounty-service";
import SubcountyForm from "./SubcountyForm";
import EditForm from "./EditForm";
import MuiTable from "../../../components/general_components/MuiTable";
import WaterIsLoading from "../../../components/general_components/WaterIsLoading";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

import { Panel } from "primereact/panel";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function SubcountyList({ selectedCounty }) {
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

    const getListOfSubCounties = useQuery(["subcounties", selectedCounty?.id], () => (!selectedCounty?.id ? getAllSubcounty() : getAllSubcounty({ county_id: selectedCounty?.id })), {
        onSuccess: (data) => {},
        onError: (error) => {
            console.log("Error fetching sub counties : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
        },
    });

    console.log("getListOfSubCounties : ", getListOfSubCounties);

    const deleteSubCountiesMutation = useMutation(deleteSubcountyById, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["subcounties"]);
            setLoading(false);
        },
        onError: (err) => {
            // Show some error toast or message if required
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
                deleteSubCountiesMutation.mutate(id);
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
                return <div>{rowData.tableData.id}</div>;
            },
        },
        ...(!selectedCounty
            ? [
                  {
                      title: "Name",
                      cellStyle: {
                          whiteSpace: "nowrap",
                          padding: "8px",
                      },
                      field: "name",
                      // If selectedCounty is true, we render the name as plain text
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
                      // If selectedCounty is false, we render the name as a link
                      render: (rowData) => {
                          return (
                              <Link to="parishes" state={{ selectedSubCounty: rowData }} className="text-decoration-none">
                                  {rowData.name}
                              </Link>
                          );
                      },
                  },
              ]),
        {
            title: "County Name",
            field: "county.name",
        },
        {
            title: "Date",
            field: "created_at",
            render: (rowData) => moment(rowData.created_at).format("lll"),
        },
    ];

    return (
        <div>
            <Panel header="Sub Counties" style={{ marginBottom: "20px" }}>
                {selectedCounty && (
                    <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end" }}>
                        <Button label="Add Subcounty" onClick={() => setShowAddForm(true)} />
                        <SubcountyForm selectedCounty={selectedCounty} show={showAddForm} onHide={() => setShowAddForm(false)} onClose={() => setShowAddForm(false)} />
                    </div>
                )}

                <MuiTable
                    tableTitle="Sub Counties"
                    tableData={getListOfSubCounties?.data?.data?.data}
                    tableColumns={columns}
                    handleShowEditForm={handleShowEditForm}
                    handleDelete={handleDelete}
                    showEdit={selectedCounty ? true : false}
                    showDelete={true}
                    loading={loading || getListOfSubCounties.isLoading || deleteSubCountiesMutation.isLoading}
                />
                {/* <ConfirmDialog /> */}
                <EditForm selectedCounty={selectedCounty} subcountyData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />
                {(loading || getListOfSubCounties.isLoading || deleteSubCountiesMutation.isLoading) && <WaterIsLoading />}
            </Panel>
        </div>
    );
}

export default SubcountyList;
