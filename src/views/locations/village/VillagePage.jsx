import React from "react";
import VillageList from "./VillageList";
import { Link } from "react-router-dom";

import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useLocation } from "react-router-dom";

const createBreadCrump = () => {};
//
function VillagePage() {
    let { state } = useLocation();
    let selectedParish = state ? state.selectedParish : null;
    return (
        <div>
            <BreadcrumbNav />

            <VillageList selectedParish={selectedParish} />
        </div>
    );
}

export default VillagePage;
