import React, { Component } from 'react';
import '../../css/shared/Navbar.css';
import { Redirect } from 'react-router';

import { deleteStorage } from '../../utils/Storage';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FiSettings } from 'react-icons/fi';
import { IconContext } from 'react-icons';

export default class navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isAdmin: localStorage.getItem('isAdmin'),
      isStudent: localStorage.getItem('isStudent'),
      isCoordinator: localStorage.getItem('isCoordinator'),
      isSupervisor: localStorage.getItem('isSupervisor'),
      panel: this.props.panel,
      logout: false,
    };
    this.logout = this.logout.bind(this);
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  logout() {
    deleteStorage('auth-token');
    deleteStorage('isAdmin');
    deleteStorage('isStudent');
    deleteStorage('isCoordinator');
    deleteStorage('isSupervisor');
    this.setState({
      logout: true,
    });
    // this.context.router.push('/');
    // window.location.reload(false);

    // let history = useHistory();
    // history.push('/');
  }

  render() {
    if (this.state.logout) {
      return <Redirect to='/' push={true} />;
    }
    return (
      <Router>
        <MDBNavbar
          color='special-color-dark'
          // #263238
          dark
          expand='md'
          className='navbar'
        >
          <MDBNavbarBrand>
            {/* eslint-disable-next-line */}
            <img
              style={{ width: '12%' }}
              src={require('../../assets/logo/Logo_white.png')}
            />
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id='navbarCollapse3' isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav right>
              <MDBNavItem>
                {this.state.panel === 'admin' ? (
                  <Nav.Link href='/adminhome'>Home</Nav.Link>
                ) : null}
                {this.state.panel === 'student' ? (
                  <Nav.Link href='/studenthome'>Home</Nav.Link>
                ) : null}
                {this.state.panel === 'supervisor' ? (
                  <Nav.Link href='/supervisorhome'>Home</Nav.Link>
                ) : null}
                {this.state.panel === 'coordinator' ? (
                  <Nav.Link href='/coordinatorhome'>Home</Nav.Link>
                ) : null}
              </MDBNavItem>

              {/* =============================== Coordinator Panel================================ */}
              {this.state.panel === 'coordinator' && (
                <MDBNavItem>
                  <Nav.Link href='/coordinatorhome/createGroups'>Create Groups</Nav.Link>
                </MDBNavItem>
              )}
              &nbsp; &nbsp; &nbsp;

              
              {/* =============================== Admin Panel================================ */}
              {this.state.panel === 'admin' && (
                <MDBNavItem>
                  <Nav.Link  className="padding-zero"  href='/adminhome/viewusers'>Users</Nav.Link>
                </MDBNavItem>
              )}
              &nbsp; &nbsp; &nbsp;
              {this.state.panel === 'admin' && (
                <MDBNavItem>
                  <Nav.Link  className="padding-zero"   href='/adminhome/registration'>Registration</Nav.Link>
                </MDBNavItem>
              )}
              &nbsp; &nbsp; &nbsp;
              {this.state.panel === 'admin' && (
                <MDBNavItem>
                  <Nav.Link  className="padding-zero"   href='/adminhome/createproject'>
                    Create Project
                  </Nav.Link>
                </MDBNavItem>
              )}
              &nbsp; &nbsp; &nbsp;
              {this.state.panel === 'admin' && (
                <MDBNavItem >
                  <Nav.Link  className="padding-zero"   href='/adminhome/projecttypes'>
                    Project Categories
                  </Nav.Link>
                </MDBNavItem>
              )}
              &nbsp; &nbsp; &nbsp;
              {this.state.panel === 'admin' && (
                <MDBNavItem>
                  <Nav.Link  className="padding-zero"   href='/shared/notice'>
                    Create Notice
                  </Nav.Link>
                </MDBNavItem>
              )}
              {/* ========================================================================= */}
              &nbsp; &nbsp; &nbsp;
              <MDBNavItem>
                {this.state.isCoordinator ||
                  this.state.isSupervisor ||
                  this.state.isAdmin ? (
                    <MDBDropdown style={{ backgroundColor: '#1C2331' }} dark>
                      <MDBDropdownToggle nav caret>
                        <span className='mr-2'>Profile</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem href='/profile'>
                          <IconContext.Provider
                            value={{
                              color: '#263238',
                              className: 'global-class-name',
                              style: {
                                verticalAlign: 'middle',
                              },
                            }}
                          >
                            <div>
                              <FiSettings />
                            &nbsp; &nbsp; &nbsp;
                            <span>Settings</span>
                            </div>
                          </IconContext.Provider>
                        </MDBDropdownItem>
                        {((this.state.isSupervisor && this.state.isCoordinator) ||
                          (this.state.isSupervisor && this.state.isAdmin) ||
                          (this.state.isAdmin && this.state.isCoordinator)) && (
                            <MDBDropdownItem divider />
                          )}

                        {this.state.panel === 'supervisor' &&
                          this.state.isAdmin && (
                            <MDBDropdownItem href='/adminhome'>
                              Switch to Admin
                            </MDBDropdownItem>
                          )}
                        {this.state.panel === 'supervisor' &&
                          this.state.isCoordinator && (
                            <MDBDropdownItem href='/coordinatorhome'>
                              Switch to Coordinator
                            </MDBDropdownItem>
                          )}

                        {this.state.panel === 'coordinator' &&
                          this.state.isAdmin && (
                            <MDBDropdownItem href='/adminHome'>
                              Switch to Admin
                            </MDBDropdownItem>
                          )}
                        {this.state.panel === 'coordinator' &&
                          this.state.isSupervisor && (
                            <MDBDropdownItem href='/supervisorhome'>
                              Switch to Supervisor
                            </MDBDropdownItem>
                          )}

                        {this.state.panel === 'admin' &&
                          this.state.isCoordinator && (
                            <MDBDropdownItem href='/coordinatorhome'>
                              Switch to Coordinator
                            </MDBDropdownItem>
                          )}
                        {this.state.panel === 'admin' &&
                          this.state.isSupervisor && (
                            <MDBDropdownItem href='/supervisorhome'>
                              Switch to Supervisor
                            </MDBDropdownItem>
                          )}
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  ) : (
                    <Nav.Link   className="padding-zero"   href='/profile'>Profile</Nav.Link>
                  )}
              </MDBNavItem>
              &nbsp; &nbsp; &nbsp;
              <MDBNavItem>
                <Nav.Link   className="padding-zero"  onClick={this.logout}>Logout</Nav.Link>
              </MDBNavItem>

              

            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
      </Router>
    );
  }
}
