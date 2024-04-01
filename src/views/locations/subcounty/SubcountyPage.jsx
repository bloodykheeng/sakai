import React from "react";
import SubcountyList from "./SubcountyList";
import { Link } from "react-router-dom";

import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useLocation } from "react-router-dom";

const createBreadCrump = () => {};
//
function SubcountyPage() {
    let { state } = useLocation();
    let selectedCounty = state ? state.selectedCounty : null;
    return (
        <div>
            <BreadcrumbNav />

            <SubcountyList selectedCounty={selectedCounty} />
        </div>
    );
}

export default SubcountyPage;
