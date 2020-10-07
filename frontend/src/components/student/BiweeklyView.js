import React, { Component } from 'react'
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import AttachmentIcon from '@material-ui/icons/Attachment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import axios from 'axios';

import '../../css/students/SubmisionViewStu.scss'
import {
     Button,
     Container,
     Col,
     Row,
     FormGroup,
     FormControl,


} from "react-bootstrap";
const backendURI = require("../shared/BackendURI");

export class BiweeklyView extends Component {

     constructor(props) {
          super(props)

          this.state = {
               groupDetails: props.location.state.groupDetails,
               projectId: this.props.match.params.id,
               biweeklyList: [],
          }


          this.getBiweekly = this.getBiweekly.bind(this);
          //console.log("Ashan",this.state.groupDetails);
          //console.log('Ashan',this.state.submissionList);

     }

     //button for view upcomming submission
     biweeklyView = (data) => {
          this.props.history.push('/studenthome/biweeklyview/biweeklysubmisionpanel/' + data._id)
     }

     componentDidMount() {

          this.getBiweekly()

     }

     //get submision details from database
     getBiweekly() {
          axios.get(backendURI.url + '/Biweekly/getBiweeklyLink/' + this.state.projectId)
               .then((res => {
                    console.log("ssssssssssssss", res.data.data)
                    this.setState({
                         biweeklyList: res.data.data
                    })
               })).catch(err => {
                    console.log(err)
               })

               console.log(this.state.biweeklyList)
     }

     render() {
          //console.log("sss",this.state.submissionList);
          return (
               <React.Fragment>
                    <Navbar panel={"student"} />

                    <div className=" sub-style ">
                         <div className=" container-fluid  sub-background ">
                          <div className="container">
                            {this.state.biweeklyList.length > 0 && (
                            <div>
                            {this.state.biweeklyList.map((type) => {
                                                  return (
                                                     <div className=" card container" style={{ margin: "0px 0px 20px 0px" }} key={type._id}>
                                                            <div className="row">
                                                                 <div className="col-xm-1" style={{ backgroundColor: '#263238', width: 35 }}>
                                                                 </div>
                                                                 <div className="col-sm-11">
                                                                    <h2 className="sup-tittle">Biweekly Report #{type.biweeklyNumber}</h2>
                                                                      <div >

                                                                           <span><AttachmentIcon /></span>
                                                                           <a className="sub-link" href={"http://localhost:4000/biweekly/biweeklyAttachment/" + type.filePath}>
                                                                                #{type.biweeklyNumber} Biweekly Template
                                                                           </a>
                                                                      </div>
                                                                      <Row>
                                                                           <Col md={10} xs={1} >
                                                                                <a>
                                                                                     <span><AssignmentIcon /></span>
                                                                                     <span className="sub-content" >{type.proposelTittle} Biweekly Submite (Deadline - {type.deadDate}: {type.deadTime})</span>
                                                                                </a>
                                                                           </Col>
                                                                           <Col md={2} xs={2}>
                                                                                <div>

                                                                                     <Button size="sm" className="btn btn-info "  onClick={() => { this.biweeklyView(type) }}>Add Submission</Button>
                                                                                </div>
                                                                           </Col>
                                                                      </Row>
                                                                 </div>
                                                            </div>

                                                       </div>
                                                  )
                                             })}

                                        </div>
                                   )}
                              </div>
                         </div>

                    </div>


                    <Footer />
               </React.Fragment>
          )
     }
}

export default BiweeklyView
