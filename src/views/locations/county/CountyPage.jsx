import React from "react";
import CountyList from "./CountyList";
import { Link } from "react-router-dom";

import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useLocation } from "react-router-dom";

const createBreadCrump = () => {};
//
function CountyPage() {
    let { state } = useLocation();
    let selectedDistrict = state ? state.selectedDistrict : null;
    return (
        <div>
            <BreadcrumbNav />

            <CountyList selectedDistrict={selectedDistrict} />
        </div>
    );
}

export default CountyPage;
