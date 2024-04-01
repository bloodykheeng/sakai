import React from "react";
import ParishList from "./ParishList";
import { Link } from "react-router-dom";

import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useLocation } from "react-router-dom";

const createBreadCrump = () => {};
//
function ParishPage() {
    let { state } = useLocation();
    let selectedSubCounty = state ? state.selectedSubCounty : null;
    return (
        <div>
            <BreadcrumbNav />

            <ParishList selectedSubCounty={selectedSubCounty} />
        </div>
    );
}

export default ParishPage;
