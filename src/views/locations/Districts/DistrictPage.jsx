import React from "react";
import DistrictList from "./DistrictList";
import { Link } from "react-router-dom";

import BreadcrumbNav from "../../../components/general_components/BreadcrumbNav";
import "primereact/resources/themes/lara-light-indigo/theme.css";

const createBreadCrump = () => {};
//
function DistrictPage() {
    return (
        <div>
            <BreadcrumbNav />

            <DistrictList />
        </div>
    );
}

export default DistrictPage;
