import React, { useState, useEffect } from "react";
// import { Card } from "primereact/card";
import { Tree } from "primereact/tree";
import { Divider } from "primereact/divider";
import { useLocation } from "react-router-dom";
import { Panel } from "primereact/panel";
import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";
import { Button } from "primereact/button";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Fieldset } from "primereact/fieldset";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TabView, TabPanel } from "primereact/tabview";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

// import VillageCensusPage from "./village-population-census/VillageCensusPage";

import { getAllVillage, getVillageById, postVillage, updateVillage, deleteVillageById } from "../../../../services/village/village-service";

const VillageViewPage = ({ loggedInUserData }) => {
    const queryClient = useQueryClient();
    //
    let { state } = useLocation();
    let villageData = state?.villageData ? state?.villageData : null;
    console.log("VillageData data got from state is : ", villageData);

    //===================== getDepartmentById by id =================
    const fetchVillageById = useQuery(["villages", "getById", villageData?.id], () => getVillageById(villageData?.id), {
        onSuccess: (data) => {
            console.log("villages onsuccess fetching : ", data);
        },
        onError: (error) => {
            // props.onClose();
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : toast.error("Án Error Occured Please Contact Admin");
            console.log("get list of villages : ", error);
        },
    });

    const [selectedItem, setSelectedItem] = useState();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showBudjetOutPutAddForm, setShowBudjetOutPutAddForm] = useState(false);

    const handleShowEditForm = (item) => {
        setSelectedItem(item);
        setShowEditForm(true);
        console.log("handleShowEditForm is : ", item);
    };
    const handleCloseEditForm = () => {
        setSelectedItem({ id: null });
        setShowEditForm(false);
    };

    const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;

    const onFormClose = () => {
        setShowAddForm(false);
    };

    return (
        <div style={{ width: "100%" }}>
            <BreadcrumbNav />
            <div className="projects-view-page">
                <Panel header={`${villageData?.name} Village  Details`} style={{ marginBottom: "20px" }}>
                    <TabView scrollable>
                        <TabPanel header="Details">
                            <div className="flex flex-wrap">
                                {/* Column 1 */}
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <p>
                                        <strong>Village Name:</strong> {villageData?.name}
                                    </p>
                                </div>

                                {/* Column 2 */}
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <p>
                                        <strong>Village Parish:</strong> {villageData?.parish?.name}
                                    </p>

                                    {/* <p>
                                        <strong>Updated By:</strong> {villageData?.updated_by?.email || "N/A"}
                                    </p> */}
                                </div>
                            </div>

                            <Divider />
                        </TabPanel>
                        {/* <TabPanel header="Population Census">
                            <VillageCensusPage loggedInUserData={loggedInUserData} selectedVillageItem={villageData || fetchVillageById?.data?.data?.data} VillageId={villageData?.id || fetchVillageById?.data?.data?.data?.id} />
                        </TabPanel> */}

                        {/* <TabPanel header="Directorate Reports"></TabPanel> */}
                    </TabView>
                </Panel>
            </div>
        </div>
    );
};

export default VillageViewPage;

// Sample usage:
// <ProjectsViewPage project={{
//     name: 'Urban Development Project',
//     code: 'UD123',
//     Village: 'Urban Planning',
//     type: 'Development',
//     responsibleOfficer: 'John Doe',
//     details: 'This project focuses on...',
//     districts: [{ id: '1', name: 'District 1' }, { id: '2', name: 'District 2' }]
// }} />
