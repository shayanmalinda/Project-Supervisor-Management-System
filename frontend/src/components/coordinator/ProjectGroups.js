import React, { Component } from 'react';
import '../../css/coordinator/ProjectGroups.scss';
import Navbar from '../shared/Navbar';
import { verifyAuth } from "../../utils/Authentication";
import { Row, Col } from "reactstrap";
import { getFromStorage } from '../../utils/Storage';
import Footer from '../shared/Footer'
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../shared/Snackpop";
import 'react-confirm-alert/src/react-confirm-alert.css'

const backendURI = require('../shared/BackendURI');

class groupDataBlock {
    constructor(_id, groupId, projectId, groupEmail,groupMembers, supervisors) {
        this._id = _id;
        this.groupId = groupId;
        this.projectId = projectId;
        this.groupMembers = groupMembers;
        this.supervisors = supervisors;
        this.groupEmail = groupEmail;
    }
}
class ProjectGroups extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectId: '',

            activeProjects: [],
            groupData: [],
            groupDataBlock: [],
            supervisorsNames: [],

            dataDiv: false,
            spinnerDiv: false,

            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            mouseState: false,


        }
        this.deleteGroup = this.deleteGroup.bind(this)
        this.searchGroups = this.searchGroups.bind(this);
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    async componentDidMount() {
        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) { //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        const coId = JSON.parse(localStorage.getItem("auth-id"))

        //? load all the active project names from
        axios.get(backendURI.url + '/projects/active&projects/' + coId.id)
            .then((res => {
                this.setState({
                    activeProjects: res.data.data
                })
            }))
    }

    //? select project drop down change
    handleDropdownChange = (e) => {
        const val = e.target.value
        this.setState({
            projectId: val
        })
    }

    async searchGroups() {
        this.setState({
            spinnerDiv: true,
            groupDataBlock: []
        })

        await axios.get(backendURI.url + '/createGroups/get/' + this.state.projectId)
            .then(res => {


                this.setState({
                    groupData: res.data.data
                })
            })

        for (let i = 0; i < this.state.groupData.length; i++) {
            if (this.state.groupData[i].supervisors.length !== 0) {
                var array1 = [];
                var array2 = [];
                for (let j = 0; j < this.state.groupData[i].supervisors.length; j++) {
                    await axios.get(backendURI.url + '/users/getUserName/' + this.state.groupData[i].supervisors[j])
                        .then(res => {
                            var supervisorName = res.data.data[0].firstName + ' ' + res.data.data[0].lastName + ', ';
                            array1.push(supervisorName)
                        })
                }
                for (let k = 0; k < this.state.groupData[i].groupMembers.length; k++) {
                    var newMember = this.state.groupData[i].groupMembers[k] + ', '
                    array2.push(newMember)
                }
                var block = new groupDataBlock(
                    this.state.groupData[i]._id,
                    this.state.groupData[i].groupId,
                    this.state.groupData[i].projectId,
                    this.state.groupData[i].groupEmail,
                    array2,
                    array1
                )
                // this.state.groupDataBlock.push(block)
                this.setState({
                    groupDataBlock: [...this.state.groupDataBlock, block]
                })
            } else {
                var array3 = [];
                for (let k = 0; k < this.state.groupData[i].groupMembers.length; k++) {
                    var newMemberA = this.state.groupData[i].groupMembers[k] + ', '
                    array3.push(newMemberA)
                }
                var blockA = new groupDataBlock(
                    this.state.groupData[i]._id,
                    this.state.groupData[i].groupId,
                    this.state.groupData[i].projectId,
                    this.state.groupData[i].groupEmail,
                    array3,
                    ''
                )
                this.setState({
                    groupDataBlock: [...this.state.groupDataBlock, blockA]
                })
                // this.state.groupDataBlock.push(blockA)
            }
        }
        this.setState({ dataDiv: true, spinnerDiv: false });

    }

    //? opent the gropuData window
    groupDataHandler(data) {
        if (this.state.mouseState === false) {
            this.props.history.push('/coordinatorhome/groupData/' + data, { projectId: this.state.projectId, pId: this.state.projectId });
        }
    }

    //?delete the group
    deleteGroup(id) {
        confirmAlert({
            title: 'Confirm to Delete?',
            message: 'Are you sure to do this ?',
            buttons: [{
                label: 'Yes',
                onClick: () => {
                    const obj = getFromStorage('auth-token');
                    fetch(backendURI.url + '/createGroups/delete/' + id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': obj.token
                        },
                    })
                        .then(res => res.json())
                        .then(json => {
                            if (json.state === true) {
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: json.msg,
                                    snackbarcolor: 'success',
                                })
                                window.location.reload();
                            } else {
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: json.msg,
                                    snackbarcolor: 'error',
                                })
                            }
                        })
                        .catch(err => {
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg: err,
                                snackbarcolor: 'error',
                            })
                        })
                }
            },
            {
                label: 'No',
                onClick: () => {

                }
            }
            ]
        })
    }
    render() {
        const { activeProjects, dataDiv, spinnerDiv } = this.state;   // ?load projects to dropdown menu this coordinator

        let activeProjectsList = activeProjects.length > 0
            && activeProjects.map((item, i) => {
                return (
                    <option key={i} value={item._id}>{item.projectYear} - {item.projectType} - {item.academicYear}</option>
                )
            }, this)

        return (
            <div className="pg-fullpage">
                <Navbar panel={"coordinator"} />
                <div className="container pg-container-div">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    <div className="card pg-search-card">
                        <div className="container">
                            <div className="container">

                                <p className="pg-reg-head">Project Group Details</p>

                                <Row >
                                    <Col md="10" xs="12">
                                        <div className="form-group pg-dropdown-select">
                                            <select className="form-control pg-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                                                <option>Select the project</option>
                                                {activeProjectsList}
                                            </select>
                                        </div>
                                    </Col>
                                    <Col md="2" xs="12">
                                        <button className="btn btn-info pg-btn" style={{ width: '100%' }} onClick={this.searchGroups}>Search</button>
                                    </Col>
                                </Row>
                            </div>
                            {spinnerDiv && (
                                <div className="spinner">
                                    <Spinner style={{ marginBottom: "10px", marginTop: "-20px" }} animation="border" variant="info" />
                                </div>
                            )}
                            {dataDiv && (
                                <div className="container">
                                    <p className="pg-details-head">Project Groups</p>

                                    {/* <table className="table table-striped" style={{ marginTop: 20 }} > */}
                                    <Table hover className="pg-table project-groups" >

                                        <thead>
                                            <tr>
                                                <th className="table-head">No.</th>
                                                <th className="table-head">Email</th>
                                                <th className="table-head">Members' Ids</th>
                                                <th className="table-head">Supervisors</th>
                                                <th className="table-head" style={{ textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.groupDataBlock.map((item) => {
                                                return (
                                                    <tr className="pg-table-row" key={item.groupId} onClick={() => this.groupDataHandler(item._id)}>
                                                        <td className="table-body tbl-item">{item.groupId}</td>
                                                        <td className="table-body tbl-item">{item.groupEmail}</td>
                                                        <td className="table-body tbl-item">{item.groupMembers}</td>
                                                        <td className="table-body tbl-item">{item.supervisors}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <span onMouseEnter={() => this.setState({ mouseState: true })} onMouseLeave={() => this.setState({ mouseState: false })}>
                                                                <DeleteForeverIcon className="del-btn" fontSize="default" onClick={() => this.deleteGroup(item._id)} />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        );
    }
}

export default ProjectGroups;