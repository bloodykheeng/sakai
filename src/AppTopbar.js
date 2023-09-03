import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useActive } from "./context/ActiveContext";
import { Menu } from "primereact/menu";

export const AppTopbar = (props) => {
    const { active, setActive } = useActive();
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);
    const profileMenuRef = useRef(null);

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

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === "light" ? "assets/layout/images/logo-dark.svg" : "assets/layout/images/logo-white.svg"} alt="logo" />
                <span>SAKAI</span>
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
                <li>
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
                </li>
                <li>
                    <button
                        className="p-link layout-topbar-button"
                        onClick={(e) => {
                            toggleProfileMenu(e);
                            props.onMobileSubTopbarMenuClick(e);
                        }}
                    >
                        <i className="pi pi-user" />
                        <span>Profile</span>
                    </button>
                    <Menu ref={profileMenuRef} model={profileMenuItems} popup appendTo={document.body} onHide={hideProfileMenu} />
                </li>
            </ul>
        </div>
    );
};
