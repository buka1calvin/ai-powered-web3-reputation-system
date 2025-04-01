import Layout from "./layouts/Layout";
import PortalLayout from "./layouts/PortalLayout";
import TeacherPortalLayout from "./layouts/TeacherPortalLayout";
import LinkedInCallback from "./pages/callBacks/LinkedinCallBack";
import Home from "./pages/landingPage";
import Login from "./pages/login";
import RecruiterProfileCreation from "./pages/profile/CreateProfileRecruiter";
import ProfileCreation from "./pages/profile/creatProfile";
import Profile from "./pages/profile/Profile";
import PublicProfilePage from "./pages/profile/PublicProfile";
import SearchResults from "./pages/profile/SearchResults";
import Signup from "./pages/signup";
import { RouteConfig } from "./types/routes/ route";

const routes: RouteConfig[] = [
  {
    path: "/",
    element: Layout,
    protected: false,
    children: [
      {
        path: "",
        element: Home,
        protected: false,
        allowedRoles: ["developer", "recruiter"],
      },
      {
        path: "/profile",
        element: Profile,
        protected: true,
        allowedRoles: ["developer", "recruiter"],
      },
      {
        path: "/profile/:username",
        element:PublicProfilePage,
        protected: false,
        allowedRoles: ["developer", "recruiter"],
      },
      {
        path: "search",
        element: SearchResults,
        protected: false,
        allowedRoles: ["developer", "recruiter"],
      },
      {
        path: "profile/create",
        element: ProfileCreation,
        protected: true,
        allowedRoles: ["developer", "recruiter"],
      },
      { path: "/signup", element: Signup, protected: false },
      { path: "/login", element: Login, protected: false },
      {
        path: "/auth/linkedin/callback",
        element: LinkedInCallback
      },
      {
        path: "/profile/create-recruiter",
        element: RecruiterProfileCreation
      },
    ],
  },
];

export default routes;
