import React, { Component } from "react";
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import '../../css/students/ViewMeeting.scss';
import RequestMeeting from "./RequestMeeting";
import axios from 'axios';
import ViewMeetBlock from "./ViewMeetBlock";
const backendURI = require('../shared/BackendURI');

class meetBlock {
  constructor(id, purpose, date, time, supervisor) {
    this.id = id;
    this.purpose = purpose;
    this.date = date;
    this.time = time;
    this.supervisor = supervisor;

  }
}

class ViewMeeting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      project: props.location.state.projectDetails,
      group: props.location.state.groupDetails,
      superNa: [],
      meetB: [],
      viewMeetDiv: false,
    };
  }

  componentDidMount = async () => {
    console.log(this.state.group.groupId);

    await axios.get(backendURI.url + '/requestMeeting/get/' + this.state.group.groupId)
      .then(response => {
        console.log(response.data.data);

        this.setState({ meetings: response.data.data });
        console.log(this.state.meetings.length);

      }).catch(function (error) {
        console.log(error);
      })

    for (let i = 0; i < this.state.meetings.length; i++) {
      await axios.get(backendURI.url + '/users/getUserName/' + this.state.meetings[i].supervisor)
        .then(res => {
          console.log(res.data.data);
          const data = {
            superName: res.data.data[0].firstName + ' ' + res.data.data[0].lastName,
            id: res.data.data[0]._id
          }

          this.setState({
            superNa: [...this.state.superNa, data],
          })
        })
      console.log(this.state.superNa);

      var block = new meetBlock(
        this.state.meetings[i]._id,
        this.state.meetings[i].purpose,
        this.state.meetings[i].date,
        this.state.meetings[i].time,
        this.state.superNa[i].superName,

      )
      this.setState({
        meetB: [...this.state.meetB, block],
      })

    }
    console.log(this.state.meetB);
    this.setState({
      viewMeetDiv: true,
    })
  }

  render() {

    const { viewMeetDiv } = this.state
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        <div className="container-fluid" styles={{ height: "1500px" }}>

          <div className="container student-view-meeting">
            <RequestMeeting project={this.state.project} group={this.state.group} />
            {viewMeetDiv &&
            
              <ViewMeetBlock data={this.state.meetB} />
            }
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default ViewMeeting;

