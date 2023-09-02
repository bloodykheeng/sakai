import React, { lazy, Suspense, useState } from "react";

const DashboardPage = lazy(() => import("./components/Dashboard"));
const FormLayoutDemo = lazy(() => import("./components/FormLayoutDemo"));
const InputDemo = lazy(() => import("./components/InputDemo"));
const FloatLabelDemo = lazy(() => import("./components/FloatLabelDemo"));
const InvalidStateDemo = lazy(() => import("./components/InvalidStateDemo"));
const ButtonDemo = lazy(() => import("./components/ButtonDemo"));
const TableDemo = lazy(() => import("./components/TableDemo"));
const ListDemo = lazy(() => import("./components/ListDemo"));
const TreeDemo = lazy(() => import("./components/TreeDemo"));
const PanelDemo = lazy(() => import("./components/PanelDemo"));
const OverlayDemo = lazy(() => import("./components/OverlayDemo"));
const MediaDemo = lazy(() => import("./components/MediaDemo"));
const MenuDemo = lazy(() => import("./components/MenuDemo"));
const MessagesDemo = lazy(() => import("./components/MessagesDemo"));
const BlocksDemo = lazy(() => import("./components/BlocksDemo"));
const IconsDemo = lazy(() => import("./components/IconsDemo"));
const FileDemo = lazy(() => import("./components/FileDemo"));
const ChartDemo = lazy(() => import("./components/ChartDemo"));
const MiscDemo = lazy(() => import("./components/MiscDemo"));
const Crud = lazy(() => import("./pages/Crud"));
const EmptyPage = lazy(() => import("./pages/EmptyPage"));
const TimelineDemo = lazy(() => import("./pages/TimelineDemo"));
const Documentation = lazy(() => import("./components/Documentation"));

function AppRoutes() {
    const privateDefaultRoutes = [
        {
            path: "/",
            name: "dashboard",
            element: DashboardPage, // Replace with the actual component
            layout: "/private",
        },
        {
            path: "/formlayout",
            name: "formlayout",
            element: FormLayoutDemo,
            layout: "/private",
        },
        {
            path: "/input",
            name: "input",
            element: InputDemo,
            layout: "/private",
        },
        {
            path: "/floatlabel",
            name: "floatlabel",
            element: FloatLabelDemo,
            layout: "/private",
        },
        {
            path: "/invalidstate",
            name: "invalidstate",
            element: InvalidStateDemo,
            layout: "/private",
        },
        {
            path: "/button",
            name: "button",
            element: ButtonDemo,
            layout: "/private",
        },
        {
            path: "/table",
            name: "table",
            element: TableDemo,
            layout: "/private",
        },
        {
            path: "/list",
            name: "list",
            element: ListDemo,
            layout: "/private",
        },
        {
            path: "/tree",
            name: "tree",
            element: TreeDemo,
            layout: "/private",
        },
        {
            path: "/panel",
            name: "panel",
            element: PanelDemo,
            layout: "/private",
        },
        {
            path: "/overlay",
            name: "overlay",
            element: OverlayDemo,
            layout: "/private",
        },
        {
            path: "/media",
            name: "media",
            element: MediaDemo,
            layout: "/private",
        },
        {
            path: "/menu",
            name: "menu",
            element: MenuDemo,
            layout: "/private",
        },
        {
            path: "/messages",
            name: "messages",
            element: MessagesDemo,
            layout: "/private",
        },
        {
            path: "/blocks",
            name: "blocks",
            element: BlocksDemo,
            layout: "/private",
        },
        {
            path: "/icons",
            name: "icons",
            element: IconsDemo,
            layout: "/private",
        },
        {
            path: "/file",
            name: "file",
            element: FileDemo,
            layout: "/private",
        },
        {
            path: "/chart",
            name: "chart",
            element: ChartDemo,
            layout: "/private",
        },
        {
            path: "/misc",
            name: "misc",
            element: MiscDemo,
            layout: "/private",
        },
        {
            path: "/timeline",
            name: "timeline",
            element: TimelineDemo,
            layout: "/private",
        },
        {
            path: "/crud",
            name: "crud",
            element: Crud,
            layout: "/private",
        },
        {
            path: "/empty",
            name: "empty",
            element: EmptyPage,
            layout: "/private",
        },
        {
            path: "/documentation",
            name: "documentation",
            element: Documentation,
            layout: "/private",
        },
    ];

    const [privateRoutes, setPrivateRoutes] = useState(privateDefaultRoutes);

    return privateRoutes;
}

export default AppRoutes;
