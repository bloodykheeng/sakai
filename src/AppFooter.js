import React from "react";

export const AppFooter = (props) => {
    return (
        <div className="layout-footer">
            <img
                src={props.layoutColorMode === "light" ? "assets/layout/images/nice-removebg-preview.png" : "assets/layout/images/nice-removebg-preview.png"}
                alt="Logo"
                //  height="20"
                style={{ height: "20px" }}
                className="mr-2"
            />
            by
            <span className="font-medium ml-2">NICE HOUSE OF PLASTICS</span>
        </div>
    );
};
