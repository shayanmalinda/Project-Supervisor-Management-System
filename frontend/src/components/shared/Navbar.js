import React, { Component } from 'react';
import '../../css/shared/Navbar.css';
import { Redirect } from 'react-router';

import { deleteStorage } from '../../utils/Storage';
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
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


const backendURI = require("./BackendURI");
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
      count: 0,
      // userType: '',
      reqId: []
    };
    this.logout = this.logout.bind(this);
    this.readRequest = this.readRequest.bind(this);
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
  readRequest() {
    const userData = getFromStorage('auth-id')
    var ob = [];
    axios.get(backendURI.url + '/users/countNotifyReq/' + userData.id)
      .then(response => {
        console.log(response.data.data2);
        ob = response.data.data2
        console.log(ob)
        console.log(ob[0]._id);

        for (var i = 0; i < ob.length; i++) {
          var Id = ob[i]._id;
          console.log(Id);
          axios.post(backendURI.url + '/users/readRequest/' + Id, Id)
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  async componentDidMount() {
    const userData = getFromStorage('auth-id')
    // const userType = getFromStorage('user-level')
    // alert(this.state.panel);
    // this.setState({ userType: userType })
    axios.get(backendURI.url + '/users/countNotifyReq/' + userData.id)
      .then(response => {

        this.setState({
          count: response.data.data,
          //reqId: response.data.data2
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    if (this.state.logout) {
      return <Redirect to='/' push={true} />;
    }
    return (
      <Router>
        {/*#263238 => NAVBAR color*/}
        <MDBNavbar color='special-color-dark' dark expand='md' className='navbar'   >
          <MDBNavbarBrand>
            <img style={{ width: '12rem' }} src={require('../../assets/logo/Project Logo white.png')} />
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id='navbarCollapse3' isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav className='navbar-nav' right>
            <MDBNavItem className="mr-4 userType"> {this.state.panel} *</MDBNavItem>
              <MDBNavItem className="mr-4">
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
                <MDBDropdown>
                  <MDBDropdownToggle nav caret>
                    <span className='mr-2'>Notice</span>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem href='/shared/noticeView'>View Notices</MDBDropdownItem>
                    <MDBDropdownItem href='/shared/notice'>Create Notice</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              )}
              &nbsp;&nbsp;&nbsp;&nbsp;

              {this.state.panel === 'coordinator' && (
                <MDBDropdown className="mr-4">
                  <MDBDropdownToggle nav caret>
                    <span className='mr-2'>Projects</span>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem href='/coordinatorhome/createGroups'>Create Groups</MDBDropdownItem>
                    <MDBDropdownItem href='/coordinatorhome/projectGroups'>Project Groups Data</MDBDropdownItem>
                    <MDBDropdownItem href='/coordinatorhome/assignSupervisors'>Assign Supervisors</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              )}

              {/* =============================== Admin Panel================================ */}
              {this.state.panel === 'admin' && (

                <MDBDropdown className="mr-4">
                  <MDBDropdownToggle nav caret>
                    <span className='mr-2'>Users</span>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem href='/adminhome/viewusers'>Manage Users</MDBDropdownItem>
                    <MDBDropdownItem href='/adminhome/registration'>User Registrations</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              )}

              {this.state.panel === 'admin' && (
                <MDBNavItem className="mr-4">
                  <Nav.Link className="padding-zero" href='/adminhome/viewmailbox'>Mail Box</Nav.Link>

                </MDBNavItem>
              )}


              {this.state.panel === 'admin' && (

                <MDBDropdown className="mr-4">
                  <MDBDropdownToggle nav caret>
                    <span className='mr-2'>Projects</span>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem href='/adminhome/projecttypes'>Project Categories</MDBDropdownItem>
                    <MDBDropdownItem href='/adminhome/createproject'>Projects</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              )}
              {this.state.panel === 'admin' && (

                <MDBDropdown className='mr-4'>
                  <MDBDropdownToggle nav caret>
                    <span className='mr-2'>Notices</span>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem href='/shared/noticeView'>View Notices</MDBDropdownItem>
                    <MDBDropdownItem href='/shared/notice'>Create Notice</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              )}





              {/* // <MDBNavItem className="mr-4">
                //   <Nav.Link  className="padding-zero"   href='/shared/notice'>
                //     Notices
                //   </Nav.Link>
                // </MDBNavItem>
               */}

              {/* ============================ Supervisor Panel ============================================= */}
              {this.state.panel === 'supervisor' && (
                <MDBNavItem className="mr-4">
                  <Nav.Link className="padding-zero" href='/shared/noticeView'>
                    Notice View
                  </Nav.Link>
                </MDBNavItem>

              )}
              {/* ============================ Supervisor Panel ============================================= */}
              {this.state.panel === 'supervisor' && (

                <MDBNavItem className="mr-4" >
                  <Nav.Link className="padding-zero" href='/supervisorhome/viewRequest' onClick={this.readRequest}>
                    RequestView
                  {(this.state.count !== 0) ? (
                      <span className="badge">{this.state.count}</span>) : null
                    }

                  </Nav.Link>
                </MDBNavItem>

              )}
              {/*==============================================================================================*/}

              {/* =============================  Student Panel  ============================================ */}

              {this.state.panel === 'student' && (

                <MDBNavItem className="mr-4">
                  <Nav.Link className="padding-zero" href='/shared/noticeView'>Notice View</Nav.Link>


                </MDBNavItem>
              )}

              {/* ========================================================================= */}

              {/* =============================  Student Panel  ============================================ */}

              {/* {this.state.panel === 'student' && (

                <MDBNavItem className="mr-4">
                  <Nav.Link className="padding-zero" href='/student/viewMeeting'>Meetings</Nav.Link>

                </MDBNavItem>
              )} */}

              {/* ========================================================================= */}

              <MDBNavItem className="mr-4">
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
                    <Nav.Link className="padding-zero" href='/profile'>Profile</Nav.Link>
                    )}
              </MDBNavItem>
              <MDBNavItem>
                <Nav.Link className="padding-zero" onClick={this.logout}>Logout</Nav.Link>
              </MDBNavItem>

            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
      </Router >
    );
  }
}
