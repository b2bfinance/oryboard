import { createBrowserRouter } from 'react-router-dom';
import DashboardContent from './pages/Dashboard';
import { DefaultLayout } from './layouts/DefaultLayout';
import { DashboardOutlined } from '@mui/icons-material';
import { RouteInfo } from './types';
import PublicIcon from "@mui/icons-material/Public";

function None() {return null}

export const routes: RouteInfo[] = [
  {
    id: "root",
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        id: "root-dashboard",
        label: "Dashboard",
        path: "/",
        element: <DashboardContent />,
        icon: <DashboardOutlined />,
      },
    ]
  },
  {
    id: "config",
    label: "Config",
    path: "/config",
    element: <DefaultLayout />,
    children: [
      {
        id: "config-editor",
        label: "Editor",
        path: "/config/editor",
        element: <None />,
        icon: <PublicIcon />
      },
    ]
  },
  {
    id: "kratos",
    label: "Kratos",
    path: "/kratos",
    element: <DefaultLayout />,
    children: [
      {
        id: "kratos-identities",
        label: "Identities",
        path: "/kratos/identities",
        element: <None />,
        icon: <PublicIcon />
      },
    ]
  },
  {
    id: "hydra",
    label: "Hydra",
    path: "/hydra",
    element: <DefaultLayout />,
    children: [
      {
        id: "hydra-applications",
        label: "Applications",
        path: "/hydra/applications",
        element: <None />,
        icon: <PublicIcon />
      },
    ]
  },
  {
    id: "keto",
    label: "Keto",
    path: "/keto",
    element: <DefaultLayout />,
    children: [
      {
        id: "keto-namespaces",
        label: "Namespaces",
        path: "/keto/namespaces",
        element: <None />,
        icon: <PublicIcon />
      },
      {
        id: "keto-relationships",
        label: "Relationships",
        path: "/keto/relationships",
        element: <None />,
        icon: <PublicIcon />
      },
    ]
  },
];

export const router = createBrowserRouter(routes);
