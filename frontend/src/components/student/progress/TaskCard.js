import React, {Component} from 'react';
import { Card, } from 'react-bootstrap';
import "../../../css/students/progress/TaskCard.scss"
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import Slider from '@material-ui/core/Slider';
import { withRouter } from "react-router-dom";
import {createMuiTheme, makeStyles} from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import { AiFillDelete } from 'react-icons/ai';
import { confirmAlert } from 'react-confirm-alert';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";

const backendURI = require('../../shared/BackendURI');
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
const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: "white",
    },
    tooltip: {
        backgroundColor: "white",
        fontSize: "14px",
        color: 'red'
    },
}));
function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip arrow classes={classes} {...props} />;
}

class TaskCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.task,
            groupDetails: this.props.groupDetails,
            projectDetails: this.props.projectDetails
        }
    }

    componentDidMount() {
        this.setState({
            totalProgress: this.state.task.totalProgress,
            title: "Delete "+this.state.task.taskTitle
        })
    }

    editTask = () => {
        this.props.history.push('/studenthome/viewproject/progresstasks/viewtask', { taskId: this.state.task._id ,groupDetails: this.state.groupDetails})
    }

    deleteTask = (e) =>{
        e.stopPropagation();
        confirmAlert({
            title: "Delete Task",
            message: 'Do you want to '+this.state.title+" ?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        const headers = {
                            'auth-token':getFromStorage('auth-token').token,
                        }
                        axios.delete(backendURI.url+'/progress/deletetask/'+this.state.task._id,{headers:headers}).then(res=>{
                            console.log(res)
                        })

                        window.location.reload(false);

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


        return (

            <Card className="task-card" onClick={this.editTask}>
                <Card.Header className="card-header">{this.state.task.taskTitle} ({this.state.task.totalProgress}%)
                    <BootstrapTooltip title={this.state.title}  placement="right">
                        <span className="delete-span" onClick={this.deleteTask}><AiFillDelete/></span>
                    </BootstrapTooltip>
                </Card.Header>
                <Card.Body className="card-body">
                    <div className="circular-progress-div">
                        {this.state.task.totalProgress<51 && <CircularProgressbar styles={buildStyles({textColor: `rgb(150,${this.state.task.totalProgress*(255/50) -100},0)`,pathColor: `rgb(255,${this.state.task.totalProgress*(255/50)},0)`,})}   value={this.state.task.totalProgress} text={`${this.state.task.totalProgress}%`} />}
                        {this.state.task.totalProgress>50 && <CircularProgressbar styles={buildStyles({textColor: `rgb(${255 - ((this.state.task.totalProgress-50)*(255/50)) -100},150,0)` ,pathColor: `rgb(${255 - ((this.state.task.totalProgress-50)*(255/50))},255,0)`,})}   value={this.state.task.totalProgress} text={`${this.state.task.totalProgress}%`} />}
                    </div>
                    <span>Task Weight</span>
                    <Card.Text>
                        <Slider disabled defaultValue={this.state.task.taskWeight} aria-labelledby="non-linear-slider"
                                valueLabelDisplay="auto" step={1} min={1} max={10} marks={marks} />
                    </Card.Text>
                </Card.Body>
            </Card>
        );

    }
}

export default withRouter(TaskCard);