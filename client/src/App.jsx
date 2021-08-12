import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import authApi from "./api/authApi";
import Notifier from "react-desktop-notification";
import WindowFocusHandler from './helpers/windowFocusHandler';

const TheLayout = React.lazy(() => import("./containers/TheLayout"));

const loading = () => <div></div>;

const App = () => {
  const [user, serUser] = useState()
  const [token, setToken] = useState()
  
  useEffect(() => {
    const jwtKey = localStorage.getItem("jwtKey");
    setToken(jwtKey)
    const getUser = async () => {
      const response = await authApi.me(token)
      serUser(response.data)
    }
    getUser()

  }, [user === undefined])

  const [pushNotification, setPushNotification] = useState({
    title: 'title',
    content: 'content',
    url: 'url',
    image: 'image'
  })

  // check if user is in current tab
  const tabFocus = WindowFocusHandler()

  // if (!tabFocus) {
  //   console.log('focus')
  // }
  
  // push notification
  useEffect(() => {
    if (!tabFocus) {
      Notifier.start(
        `${pushNotification.title}`,
        `${pushNotification.content}`,
        `${pushNotification.url}`,
        `${pushNotification.image}`
      )
    }
  }, [pushNotification])

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Switch>
            <Route
              path="/"
              name="Home"
              render={
                (props) => <TheLayout 
                  {...props} 
                  token={token}
                  user={user} 
                  pushNotification={setPushNotification}
                />
              }
            />

            <Route
              path="/contact"
              name="Contact"
              render={
                (props) => <TheLayout 
                  {...props} 
                  token={token}
                  user={user} 
                  pushNotification={setPushNotification}
                />
              }
            />

            <Route
              path="/profile"
              name="Profile"
              render={
                (props) => <TheLayout 
                  {...props} 
                  token={token}
                  user={user} 
                />
              }
            />

            <Route
              path="/login"
              name="Login"
              render={(props) => <TheLayout {...props} />}
            />

            <Route
              path="/register"
              name="Register"
              render={(props) => <TheLayout {...props} />}
            />

            <Route
              path="/verify_email"
              name="Verify Email"
              path="/set-new-password"
              name="ForgotPassword"
              render={(props) => <TheLayout {...props} />}
            />

            <Route
              path="/verify-email-to-set-new-password"
              name="VerifyEmailForgotPassword"
              render={(props) => <TheLayout {...props} />}
            />
          </Switch>
        </Suspense>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;
