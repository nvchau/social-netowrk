import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "../routes/routes";
//import { useHistory } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
const { Header, Footer } = Layout;
const { SubMenu } = Menu;

const loading = () => <div></div>;

const TheLayout = (props) => {
  const { token, user, pushNotification } = props;
  return (
    <div className="app">
      <header>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1"><a href="/">Home</a></Menu.Item>
            <Menu.Item key="2"><a href="/contact">Contact</a></Menu.Item>
            {/* <Menu.Item key="3">Post</Menu.Item> */}
            {/* <Menu.Item key="4">Profile</Menu.Item> */}
            <SubMenu 
              style={{
                position: 'absolute',
                right: '50px',
              }} 
              title={
                <span>
                  <Avatar src={`${user?.avatar ? process.env.REACT_APP_API_URL+'/'+user?.avatar : 'images/default-avatar.png'}`} />
                  &nbsp; {user?.firstName} {user?.lastName}
                </span>
              }
            >
              <a href = '/profile'><Menu.Item key="setting:2">Profile</Menu.Item></a>
              <a href = '/login'><Menu.Item key="setting:1">Logout</Menu.Item></a>
            </SubMenu>
          </Menu>
        </Header>
      </header>

      <React.Suspense fallback={loading}>
        <Switch>
          {routes.map((route, idx) => {
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  role={route.role}
                  render={
                    (props) => <route.component 
                      {...props} 
                      token={token}
                      user={user} 
                      pushNotification={pushNotification}
                    />
                  }
                />
              )
            );
          })}
        </Switch>
      </React.Suspense>
      
      <footer>
        <Footer style={{ textAlign: 'center' }}> Internship final project - Social Network ©2021 Created by <b>TCL team</b></Footer>
      </footer>
    </div>
  );
};

export default React.memo(TheLayout);
