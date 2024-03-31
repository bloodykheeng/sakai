import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useActive } from "./context/ActiveContext";
import { Menu } from "primereact/menu";

//
import { Sidebar } from "primereact/sidebar";
import { confirmDialog } from "primereact/confirmdialog";
import useAuthContext from "./context/AuthContext";
import { Button } from "primereact/button";

export const AppTopbar = (props) => {
    const { active, setActive } = useActive();
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);
    const profileMenuRef = useRef(null);

    //
    const { getUserQuery } = useAuthContext();

    const toggleConfigurator = (event) => {
        setActive((prevState) => {
            if (prevState === "true") {
                return false;
            } else if (!prevState) {
                return "true";
            }
        });
    };

    const toggleProfileMenu = (event) => {
        setProfileMenuVisible((prevState) => !prevState);
        if (profileMenuRef.current) {
            profileMenuRef.current.toggle(event);
        }
    };

    const hideProfileMenu = () => {
        setProfileMenuVisible(false);
    };

    const profileMenuItems = [
        {
            label: "Profile Details",
            icon: "pi pi-fw pi-user",
            command: () => {
                hideProfileMenu();
                // Handle profile details click
            },
        },
        {
            label: "Sign Out",
            icon: "pi pi-fw pi-sign-out",
            command: () => {
                hideProfileMenu();
                // Handle sign out click
            },
        },
    ];

    //=============== logout =======================

    const { logoutMutation } = useAuthContext();

    const handleLogout = () => {
        confirmDialog({
            message: "Are you sure you want to Log Out?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => confirmLogout(),
            reject: cancelLogout,
        });
    };

    const confirmLogout = async () => {
        try {
            await logoutMutation.mutate();
        } catch (e) {
            console.log(e);
        }
    };

    const cancelLogout = () => {
        // setDeleteProgramId(null);
    };

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const showSidebar = () => setIsSidebarVisible(true);
    const hideSidebar = () => setIsSidebarVisible(false);
    const userDetails = getUserQuery?.data?.data;
    console.log("user details hcbdkshcd : ", userDetails);

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === "light" ? "assets/layout/images/logo-dark.svg" : "assets/layout/images/logo-white.svg"} alt="logo" />
                <span>MYCAR</span>
            </Link>

            <button type="button" className="p-link layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul
                className={classNames("layout-topbar-menu lg:flex origin-top", {
                    "layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive,
                })}
            >
                {/* <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-calendar" />
                        <span>Events</span>
                    </button>
                </li>
                <li>
                    <button
                        className="p-link layout-topbar-button"
                        onClick={(e) => {
                            toggleConfigurator(e);
                            props.onMobileSubTopbarMenuClick(e);
                        }}
                    >
                        <i className="pi pi-cog" />
                        <span>Settings</span>
                    </button>
                </li> */}
                <li>
                    <button
                        className="p-link layout-topbar-button"
                        onClick={(e) => {
                            toggleProfileMenu(e);
                            props.onMobileSubTopbarMenuClick(e);
                            showSidebar();
                        }}
                    >
                        <i className="pi pi-user" />
                        <span>Profile</span>
                    </button>
                    {/* <Menu ref={profileMenuRef} model={profileMenuItems} popup appendTo={document.body} onHide={hideProfileMenu} /> */}
                </li>
                {/* Add the logout button */}
                {logoutMutation.isLoading ? (
                    <i className="fa fa-running" />
                ) : (
                    <li>
                        <button className="p-link layout-topbar-button" onClick={handleLogout}>
                            <i className="pi pi-power-off" />
                            <span>Logout</span>
                        </button>
                    </li>
                )}
            </ul>

            <Sidebar visible={isSidebarVisible} position="right" onHide={hideSidebar}>
                <h2>Profile</h2>
                <div className="user-details">
                    <p>
                        <strong>Name:</strong> {userDetails?.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {userDetails?.email}
                    </p>
                    <p>
                        <strong>Role:</strong> {userDetails?.role}
                    </p>

                    {["Admin", "Department Commissioner", "Assistant Commissioner", "District Water Engineer", "Project Manager", "Engineer", "Utility Manager"].includes(userDetails?.role) && (
                        <p>
                            <strong>Directorate:</strong> {userDetails?.user_directorate?.name || "N/A"}
                        </p>
                    )}

                    {["Department Commissioner", "Assistant Commissioner", "District Water Engineer", "Project Manager", "Engineer", "Utility Manager"].includes(userDetails?.role) && (
                        <p>
                            <strong>Department:</strong> {userDetails?.user_department?.name || "N/A"}
                        </p>
                    )}

                    {["District Water Engineer", "Project Manager", "Engineer"].includes(userDetails?.role) && (
                        <p>
                            <strong>Department Administration:</strong> {userDetails?.user_dept_administration?.name || "N/A"}
                        </p>
                    )}

                    {["Project Manager", "Engineer"].includes(userDetails?.role) && (
                        <p>
                            <strong>Project:</strong> {userDetails?.user_project?.project_title || "N/A"}
                        </p>
                    )}

                    {userDetails?.role === "Engineer" && (
                        <p>
                            <strong>Sub Project:</strong> {userDetails?.user_subproject?.name || "N/A"}
                        </p>
                    )}

                    {userDetails?.role === "Utility Manager" && (
                        <p>
                            <strong>Utility:</strong> {userDetails?.user_utility?.name || "N/A"}
                        </p>
                    )}

                    <p>
                        <strong>Last Login:</strong> {userDetails?.lastlogin}
                    </p>
                    {/* You can add more details or format differently as needed */}
                </div>
            </Sidebar>
        </div>
    );
};
