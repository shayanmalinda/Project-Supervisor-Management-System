import React, { Component } from 'react';
import axios from 'axios';

import {
    Input,
    Label,
    Button,
    Modal,
    ModalHeader,
    ModalBody
  } from 'reactstrap';
  import { Row, Col } from "reactstrap";

  const backendURI = require("./BackendURI");

export default class Contactus extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            firstName: "",
            lastName: "",
            contactNumber: "",
            email: "",
            message: "",
         };
    }

    toggle = () => {
        this.setState({
          modal: !this.state.modal,
        });
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    };

    onSubmit(e) {
        e.preventDefault()    
        const obj = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          contactNumber: this.state.contactNumber,
          email: this.state.email,
          message: this.state.message
      };
         console.log("Gon");
         console.log(obj);
         axios.post(backendURI.url + "/contactUs/add", obj)
                .then((res) => {
                  this.setState({
                    succesAlert: true,
                });
                // this.getNoticeList();
                console.log(res.data);
              })
              .catch((error) => {
                this.setState({
                  snackbaropen: true,
                  snackbarmsg: error,
                });
                console.log(error);
              });
          }
        
    render() {
        return (
            <div>
                <Button className="btn btn-info my-4" onClick={this.toggle} href="#">
                     Message
                </Button>
                 <Modal isOpen={this.state.modal} toggle={this.toggle}> 
                <ModalHeader toggle={this.toggle}>Send your Message</ModalHeader>
                <ModalBody>
                <div className="container">
                    <div className="row">
                    </div><div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                        <form onSubmit={this.onSubmit}>

                        <Row>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">First Name: </label>
                                <input type="text" className="form-control" name="firstName" onChange={this.onChange} />
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">Last Name : </label>
                                <input type="text" className="form-control" name="lastName" onChange={this.onChange} />
                             </div>
                            </Col>
                          </Row>
                            
                          <div className="form-group">
                                <Label for="avatar">Contact Number</Label>
                                <Input type="number" className="form-control" name="contactNumber"  onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <Label for="avatar">Email</Label>
                                <Input type="text" className="form-control" name="email"  onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <Label for="avatar">Message</Label>
                                <Input type="textarea" className="form-control" name="message"  onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <Button className="btn btn-info my-4"  type="submit">Send</Button>
                            </div>
                        </form>
                    </div>
                </div>
                </ModalBody>
            </Modal>
            </div>          
        )
    }
}

