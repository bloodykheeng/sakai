import moment from "moment";
import React, { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { deleteCountyById, getAllCounty } from "../../../services/county/county-service";
import CountyForm from "./CountyForm";
import EditForm from "./EditForm";
import MuiTable from "../../../components/general_components/MuiTable";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

import { Panel } from "primereact/panel";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function CountyList({ selectedDistrict }) {
    const queryClient = useQueryClient();
    const [county, setCounty] = useState([]);
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

    const getListOfCounties = useQuery(["counties", selectedDistrict?.id], () => (!selectedDistrict?.id ? getAllCounty() : getAllCounty({ district_id: selectedDistrict?.id })), {
        onSuccess: (data) => {},
        onError: (error) => {
            console.log("Error fetching counties : ", error);
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
        },
    });

    console.log("getListOfCounties : ", getListOfCounties);

    const onFormClose = () => {
        setShowAddForm(false);
    };

    const deleteCountiesMutation = useMutation(deleteCountyById, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["counties"]);
            setLoading(false);
        },
        onError: (err) => {
            console.error("Error deleting county:", err);
        },
    });

    const handleDelete = (event, id) => {
        confirmDialog({
            message: "Are you sure you want to delete?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                setLoading(true);
                deleteCountiesMutation.mutate(id);
                setLoading(false);
            },
        });
    };

    const columns = [
        {
            title: "#",
            field: "id",
            width: "5%",
        },
        ...(!selectedDistrict
            ? [
                  {
                      title: "Name",
                      field: "name",
                      cellStyle: {
                          whiteSpace: "nowrap",
                          padding: "8px",
                      },
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
                      render: (rowData) => {
                          return (
                              <Link to="subcounties" state={{ selectedCounty: rowData }} className="text-decoration-none">
                                  {rowData.name}
                              </Link>
                          );
                      },
                  },
              ]),

        {
            title: "District Name",
            field: "district.name",
        },
        {
            title: "Date",
            field: "created_at",
            render: (rowData) => moment(rowData.created_at).format("lll"),
        },
    ];

    return (
        <div className="p-grid">
            <Panel header="Counties" style={{ marginBottom: "20px" }}>
                {selectedDistrict && (
                    <div style={{ height: "3rem", margin: "1rem", display: "flex", justifyContent: "flex-end" }}>
                        <Button label="Add County" onClick={() => setShowAddForm(true)} />
                        <CountyForm selectedDistrict={selectedDistrict} show={showAddForm} onHide={() => setShowAddForm(false)} onClose={onFormClose} />
                    </div>
                )}

                <div className="p-col-12">
                    <MuiTable
                        tableTitle="Counties"
                        tableData={getListOfCounties?.data?.data?.data}
                        tableColumns={columns}
                        handleShowEditForm={handleShowEditForm}
                        handleDelete={handleDelete}
                        showEdit={selectedDistrict ? true : false}
                        showDelete={true}
                        loading={loading || getListOfCounties.isLoading || getListOfCounties.status === "loading" || deleteCountiesMutation.isLoading}
                    />
                    <EditForm selectedDistrict={selectedDistrict} countyData={selectedItem} show={showEditForm} onHide={handleCloseEditForm} onClose={handleCloseEditForm} />
                    {/* {loading || getListOfCounties.isLoading || getListOfCounties.status === "loading" || deleteCountiesMutation.isLoading ? <ProgressSpinner /> : null} */}
                </div>
                {/* <ConfirmDialog />; */}
            </Panel>
        </div>
    );
}

export default CountyList;
