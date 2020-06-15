import React, {Component} from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import {Input,Label, Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import "../../../css/students/progress/Tasks.scss"
import Footer from "../../shared/Footer";
import {IconContext} from "react-icons";
import axios from 'axios'
import {AiOutlineFileAdd} from "react-icons/ai";
import {AiOutlineAppstoreAdd} from "react-icons/ai";
import Slider from '@material-ui/core/Slider';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Navbar from "../../shared/Navbar";
import {getFromStorage} from "../../../utils/Storage";
import TaskCard from "./TaskCard";

const backendURI = require('../../shared/BackendURI');
const muiTheme = createMuiTheme({
    overrides:{
        MuiSlider: {
            thumb:{
                color: "#000",
            },
            track: {
                color: '#444'
            },
            rail: {
                color: '#888'
            },
            mark: {
                backgroundColor: '#888',
            },
        }
    }
});
const marks = [
    { value: 1, label: '1',  },
    { value: 2, label: '2',  },
    { value: 3, label: '3',  },
    { value: 4, label: '4',  },
    { value: 5, label: '5',  },
    { value: 6, label: '6',  },
    { value: 7, label: '7',  },
    { value: 8, label: '8',  },
    { value: 9, label: '9',  },
    { value: 10, label: '10',  },
];

class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: props.location.state.projectDetails,
            groupDetails: props.location.state.groupDetails,
            taskWeight: 0,
            currentTasks: [],
            loading: true
        }
    }

    componentDidMount() {
        this.getTasks()
    }

    getTasks = () => {
        const groupId = this.state.groupDetails._id;
        axios.get(backendURI.url+'/progress/gettasks/'+groupId).then(res=>{
            this.setState({
                currentTasks: res.data,
                loading: false
            })
        })
    }

    openModal = () => {
        this.setState({ modal: true });
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    toggle = () => {
        this.setState({
            modal: !this.state.modal,
        });
    };
    taskWeightHandler=(event,value) => {
        this.setState({
            taskWeight: value
        })
    }

    onChangeTitle = (e) =>{
        this.setState({
            taskTitle: e.target.value
        })
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const object={
            taskTitle: this.state.taskTitle,
            taskWeight: this.state.taskWeight,
            groupId: this.state.groupDetails._id,
            groupMembers: this.state.groupDetails.groupMembers,
            totalProgress: 0,
        }
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.post(backendURI.url+'/progress/addtask',object,{headers:headers}).then(res=>{

        })

        this.setState({ modal: false });
        window.location.reload(false);

    }

    render() {
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className="container-fluid tasks tasks-background-color">
                    <div className="main-card">
                        <h2 className="project-task-title">Progress ( {this.state.groupDetails.groupName}  )</h2>
                        {this.state.loading && <div className="spinner-div"><Spinner animation="border" className="spinner"/></div>}

                        {this.state.currentTasks.length==0 && !this.state.loading && <h6 className="no-task-text">* No Tasks to Show</h6>}
                        <Row>
                            {this.state.currentTasks.map(item=>{
                                return(
                                    <Col className="task-card-col" lg={3} md={3} xs={4} sm={6}>
                                        <TaskCard key={item._id} task={item} />
                                    </Col>
                                )
                            })}
                            {!this.state.loading &&
                            <Col lg={3} md={3} xs={4} sm={6}>
                                <Card className="btn-card" onClick={()=>{this.openModal()}}>
                                    <IconContext.Provider value={{ className: 'btn-icon', size:"2em"}}>
                                        <div>
                                            {/*<AiOutlineAppstoreAdd />*/}
                                            <AiOutlineFileAdd />

                                        </div>
                                    </IconContext.Provider><span className="btn-title">Add New Task</span></Card>
                            </Col>}
                        </Row>
                        <Row>
                            {/*<Col lg={4} md={4} xs={2} sm={1}></Col>*/}
                            {/*<Col lg={4} md={4} xs={2} sm={1}></Col>*/}
                        </Row>
                    </div>
                </div>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add New Task</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <div className="row">
                            </div><div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                            <form onSubmit={this.onSubmit}>

                                <div className="form-group">
                                    <Label for="avatar">Task Title</Label>
                                    <Input type="text" className="form-control" name="task-title" onChange={this.onChangeTitle} />
                                    <p className="reg-error">{this.state.contactNumberError}</p>
                                </div>

                                <div className="form-group">
                                    <Label for="avatar">Task Weight ( 1-10 )</Label>

                                    <ThemeProvider theme={muiTheme}>

                                        <Slider defaultValue={1} onChange={this.taskWeightHandler} aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto" step={1} min={1} max={10} marks={marks}/>
                                    </ThemeProvider>
                                </div>
                                <div className="form-group">
                                    <Button className="btn btn-info my-4" type="submit" block>Add Task</Button>
                                </div>
                            </form>
                        </div>
                        </div>
                    </ModalBody>
                </Modal>

                    <Footer/>
            </React.Fragment>
        );
    }
}

export default Tasks;