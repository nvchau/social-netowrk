import React from "react";

const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import('../pages/Register'))
const VerifyEmailRegister = React.lazy(() => import('../pages/VerifyEmailRegister'))
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'))
const VerifyEmailForgotPassword = React.lazy(() => import('../pages/VerifyEmail'))
const Contact = React.lazy(() => import('../pages/Contact'))
const Profile = React.lazy(() => import('../pages/Profile'))

const routes = [
  {
    path: "/",
    name: "Home",
    exact: true,
    component: Home,
    role: ["admin", "user"],
  },
  {
    path: "/login",
    name: "Login",
    exact: true,
    component: Login,
    role: ["admin", "user"],
  },
  {
    path: "/register",
    name: "Register",
    exact: true,
    component: Register,
    role: ["admin", "user"],
  },
  {
    path: "/verify-email",
    name: "VerifyEmail",
    exact: true,
    component: VerifyEmailRegister,
  },
  {  
    path: "/set-new-password",
    name: "ForgotPassword",
    exact: true,
    component: ForgotPassword,
    role: ["admin", "user"],
  },
  {
    path: "/verify-email-to-set-new-password",
    name: "VerifyEmailForgotPassword",
    exact: true,
    component: VerifyEmailForgotPassword,
    role: ["admin", "user"],
  },
  {
    path: "/contact",
    name: "Contact",
    exact: true,
    component: Contact,
    role: ["admin", "user"],
  },
  {
    path: "/profile",
    name: "Profile",
    exact: true,
    component: Profile,
    role: ["admin", "user"],
  },
];

export default routes;
