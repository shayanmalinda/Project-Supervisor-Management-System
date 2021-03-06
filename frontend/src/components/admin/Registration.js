import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../../css/admin/Registration.scss";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getFromStorage } from '../../utils/Storage';
import CSVReader from "react-csv-reader";
import Footer from '../shared/Footer'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Snackpop from "../shared/Snackpop";
import { Link } from 'react-router-dom'
import axios from 'axios'
import { userRagistrationEmail } from "../shared/emailTemplates"
import { Spinner } from 'react-bootstrap'

const backendURI = require('../shared/BackendURI');

export default class registration extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.courseChange = this.courseChange.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);

    this.state = {
      snackbaropen: false,
      snackbarmsg: '',
      snackbarcolor: '',
      form: {
        firstName: '',
        lastName: '',
        userType: '',
        email: '',
        nic: '',
        mobileNumber: '',
        indexNumber: '',
        regNumber: '',
        indexDiv: true,
        imgName: '',
        courseType: '',
      },
      spinnerDiv: false,

      //!decalaring error state variables
      firstNameError: '',
      lastNameError: '',
      userTypeError: '',
      emailError: '',
      nicError: '',
      mobileNumberError: '',
      indexNumberError: '',
      regNumberError: '',
      courseTypeError: '',

      csvData: [],
      startDate: new Date(),

      courses: [],

      failedRegistration: [],
    };
  }

  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };

  async componentDidMount() {
    const authState = await verifyAuth();

    this.setState({
      authState: authState,
    });
    if (!authState) {  //!check user is logged in or not if not re-directed to the login form
      this.props.history.push("/");
    }
    await axios.get(backendURI.url + '/courseTypes/get')
      .then(res => {
        this.setState({ courses: res.data.data })
      })
  }
  //? Bulk user registration function reading csv file
  fileUpload = (e) => {
    e.preventDefault();
    if (this.state.csvData.length === 0) {
      this.setState({
        snackbaropen: true,
        snackbarmsg: 'Please select the CSV file..!',
        snackbarcolor: 'error',
      })
    }
    else {
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              const obj = getFromStorage('auth-token');

              var myHeaders = new Headers();
              myHeaders.append("auth-token", obj.token);
              this.setState({
                spinnerDiv: true
              })
              for (var i = 0; i < this.state.csvData.length - 1; i++) {
                var firstName = this.state.csvData[i][0];
                var lastName = this.state.csvData[i][1];
                var email = this.state.csvData[i][2];
                var password = this.state.csvData[i][3];
                var nic = this.state.csvData[i][3];
                var userType = this.state.csvData[i][4];
                var mobileNumber = this.state.csvData[i][5];
                var birthday = this.state.csvData[i][6];
                var indexNumber = this.state.csvData[i][7];
                var regNumber = this.state.csvData[i][8];
                var courseType = this.state.csvData[i][9];

                var data = {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  password: password,
                  nic: nic,
                  userType: userType,
                  mobileNumber: mobileNumber,
                  birthday: birthday,
                  indexNumber: indexNumber,
                  regNumber: regNumber,
                  courseType: courseType,
                }

                await fetch(backendURI.url + "/users/bulkRegister", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'auth-token': obj.token
                  },
                  body: JSON.stringify(data),
                })
                  .then(res => res.json())
                  .then(async json => {
                    if (json.state === false) {
                      console.log(data);
                      this.setState({
                        failedRegistration: [...this.state.failedRegistration, data]
                      })
                      this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg,
                        snackbarcolor: 'error',
                      })
                    }
                    else {
                      this.setState({
                        snackbaropen: true,
                        snackbarmsg: json.msg,
                        snackbarcolor: 'success',
                      })
                      //send email notification to the clients
                      const email = await userRagistrationEmail(this.state.csvData[i][2], this.state.csvData[i][0], this.state.csvData[i][1])
                      await axios.post(backendURI.url + '/mail/sendmail', email)
                        .then(res => {
                          console.log(res);
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
              this.setState({
                spinnerDiv: false
              })
              console.log(this.state.failedRegistration);
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
  }

  onChangeDate = date => {
    this.setState(prevState => ({
      startDate: date
    }))
  }

  onChange = (e) => {
    e.persist = () => { };
    let store = this.state;
    store.form[e.target.name] = e.target.value;
    this.setState(store);
  };

  //? image file onchange 
  handleImageChange = (e) => {
    const Val = e.target.files[0]
    this.setState({
      imgName: Val.name
    })
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        file: Val
      }
    }))
  }
  //? user type drop down change
  handleDropdownChange = (e) => {
    const Val = e.target.value
    if (Val === 'Student') {
      this.setState({
        indexDiv: true
      })
    }
    else {
      this.setState({
        indexDiv: false
      })
    }
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        userType: Val
      }
    }))
  }
  courseChange = (e) => {
    const Val = e.target.value

    this.setState({
      indexDiv: true
    })
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        courseType: Val
      }
    }))
  }

  //? validation function
  validate = () => {
    let isError = false;
    const errors = {
      firstNameError: '',
      lastNameError: '',
      userTypeError: '',
      emailError: '',
      nicError: '',
      mobileNumberError: '',
      indexNumber: '',
      regNumber: '',
      courseType: '',
    };

    if (this.state.form.firstName.length < 1) {
      isError = true;
      errors.firstNameError = 'First name required *'
    }
    if (this.state.form.lastName.length < 1) {
      isError = true;
      errors.lastNameError = 'Last name required *'
    }
    if (this.state.form.email.indexOf('@') === -1) {
      isError = true;
      errors.emailError = 'Invalied email address!'
    }

    if (this.state.form.nic.length === 0 || this.state.form.nic.length > 12) {
      isError = true;
      errors.nicError = 'Invalid NIC number!'
    }
    if (this.state.form.mobileNumber.length !== 10) {
      isError = true;
      errors.mobileNumberError = 'Invalied mobile number!'
    }
    if (this.state.form.userType === '') {
      isError = true;
      errors.userTypeError = 'User type must be specified *'
    }
    if (this.state.form.courseType === '' && this.state.form.userType !== 'Admin' && this.state.form.userType !== 'Staff') {
      isError = true
      errors.courseTypeError = 'Student course must be specified *'
    }
    if (this.state.form.indexNumber.length === 0 && this.state.form.userType !== 'Admin' && this.state.form.userType !== 'Staff') {
      isError = true;
      errors.indexNumberError = 'Index number must be specified *'
    }
    if (this.state.form.regNumber.length === 0 && this.state.form.userType !== 'Admin' && this.state.form.userType !== 'Staff') {
      isError = true;
      errors.regNumberError = 'Registration number must be specified *'
    }

    this.setState({
      ...this.state,
      ...errors
    })
    return isError;  //! is not error return state 'false'
  }

  onSubmit(e) {
    e.preventDefault();
    const err = this.validate();  //?calling validation function

    if (!err) {
      this.setState({
        firstNameError: '',
        lastNameError: '',
        userTypeError: '',
        emailError: '',
        nicError: '',
        mobileNumberError: '',
        indexNumberError: '',
        regNumberError: '',
        courseTypeError: '',
      })

      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              const obj = getFromStorage('auth-token');

              const formData = new FormData();

              formData.append('profileImage', this.state.form.file);
              formData.append('firstName', this.state.form.firstName);
              formData.append('lastName', this.state.form.lastName);
              formData.append('password', this.state.form.nic);
              formData.append('nic', this.state.form.nic);
              formData.append('email', this.state.form.email);
              formData.append('userType', this.state.form.userType);
              formData.append('birthday', this.state.startDate);
              formData.append('mobileNumber', this.state.form.mobileNumber);
              formData.append('indexNumber', this.state.form.indexNumber)
              formData.append('regNumber', this.state.form.regNumber.toLowerCase())
              formData.append('courseType', this.state.form.courseType)
              var myHeaders = new Headers();
              myHeaders.append("auth-token", obj.token);

              var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formData,
                redirect: 'follow'
              };

              fetch(backendURI.url + "/users/register", requestOptions)
                .then((res) => res.json())
                .then(async (json) => {
                  if (json.state === true) {
                    this.setState({
                      snackbaropen: true,
                      snackbarmsg: json.msg,
                      snackbarcolor: 'success',
                    })
                    //send email to the client
                    const email = await userRagistrationEmail(this.state.form.email, this.state.form.firstName, this.state.form.lastName)
                    axios.post(backendURI.url + '/mail/sendmail', email)
                      .then(res => {
                        console.log(res);
                      })

                    window.location.reload();
                  }
                  else {
                    this.setState({
                      snackbaropen: true,
                      snackbarmsg: json.msg,
                      snackbarcolor: 'error',
                    })
                  }
                })
                .catch(error => {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: error,
                    snackbarcolor: 'error',
                  })
                });
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
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////


  render() {
    const { form, indexDiv, spinnerDiv } = this.state;

    //? loading csv file data into csvData array ...
    const handleForce = data => {
      console.log(data);
      this.setState({
        csvData: data
      })
    };

    return (
      <div>
        <Navbar panel={"admin"} />
        <div className="container-fluid user-registration">

          <Snackpop
            msg={this.state.snackbarmsg}
            color={this.state.snackbarcolor}
            time={3000}
            status={this.state.snackbaropen}
            closeAlert={this.closeAlert}
          />

          <Row>
            <Col md="4" xs="12" className="image-div">
              <img
                alt='background'
                src={require('../../assets/backgrounds/pngguru.png')}
                className='reg-image'
              />
            </Col>
            <Col md="8" xs="12" className="main-div">
              <div>
                <div >
                  <p className="reg-head">User Registration</p>

                  <Tabs className="tab" defaultActiveKey="bulk" id="uncontrolled-tab-example" style={{ marginTop: "40px" }}>
                    <Tab eventKey="bulk" title="Bulk">
                      <div style={{ width: "95%", margin: "auto", marginTop: "50px" }}>


                        <div className="form-group">
                          <label className="text-label">CSV File Format : </label>
                        </div>

                        <img
                          alt='background'
                          src={require('../../assets/images/Reg-CSV-Format.png')}
                          className='image2'
                        />

                        <div className="form-group reg-csv-topic">
                          <label className="text-label">Choose CSV File : </label>
                        </div>

                        <div className="container ">
                          <Row className="req-csvbtn">

                            <CSVReader
                              cssClass="react-csv-input"
                              onFileLoaded={handleForce}
                              inputStyle={{ color: 'grey' }}
                            />
                          </Row>
                        </div>
                        <div style={{ marginBottom: "20px" }}>

                          {this.state.failedRegistration.length != 0 && (
                            <p className="reg-error-title">Following users does not registered to the system..!</p>
                          )}

                          {this.state.failedRegistration.map(data => {
                            return (
                              <div className="row">
                                <Col md="2" className="reg-error-msg">{data.firstName}</Col>
                                <Col md="2" className="reg-error-msg">{data.lastName}</Col>
                                <Col md="2" className="reg-error-msg">{data.nic}</Col>
                                <Col md="2" className="reg-error-msg">{data.email}</Col>
                                <Col md="2" className="reg-error-msg">{data.userType}</Col>
                                <Col md="2" className="reg-error-msg">{data.mobileNumber}</Col>
                              </div>
                            )
                          })
                          }

                        </div>
                        {spinnerDiv && (
                          <div className="spinner">
                            <Spinner style={{ marginBottom: "20px" }} animation="border" variant="info" />
                          </div>
                        )}
                        <div className="form-group">
                          <button
                            className="btn btn-info my-4  "
                            onClick={this.fileUpload}
                            style={{ width: "100%" }}
                          >Register Now </button>
                        </div>


                      </div>
                    </Tab>
                    <Tab eventKey="single" title="Single" className="reg-tab-text">
                      <div className="container">
                        <form onSubmit={this.onSubmit}>
                          <Row style={{ marginTop: "20px" }}>
                            <Col md={6} xs="12">
                              <div className="form-group">
                                <label className="text-label">First Name: </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="firstName"
                                  value={form.firstName}
                                  onChange={this.onChange}
                                  errortext={form.firstNameError}
                                ></input>
                                <p className="reg-error">{this.state.firstNameError}</p>
                              </div>
                            </Col>
                            <Col md={6} xs="12">
                              <div className="form-group">
                                <label className="text-label">Last Name : </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="lastName"
                                  value={form.lastName}

                                  onChange={this.onChange}
                                ></input>
                                <p className="reg-error">{this.state.lastNameError}</p>

                              </div>
                            </Col>
                          </Row>

                          <div className="form-group">
                            <label className="text-label">Choose Profile Image : </label>
                          </div>
                          <Row className="input-div">
                            <Col>
                              {/* File input */}
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text"> Upload </span>
                                </div>
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="inputGroupFile01"
                                    onChange={this.handleImageChange}
                                  />
                                  <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.imgName}</label>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: "20px" }} >
                            <Col md={4} xs="12">
                              <div className="form-group">
                                <label className="text-label">E-mail : </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="email"
                                  value={form.email}
                                  onChange={this.onChange}
                                ></input>
                                <p className="reg-error">{this.state.emailError}</p>

                              </div>
                            </Col>
                            <Col md={4} xs="12">
                              <div className="form-group">
                                <label className="text-label">NIC Number : </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="nic"
                                  value={form.nic}
                                  onChange={this.onChange}
                                ></input>
                                <p className="reg-error">{this.state.nicError}</p>

                              </div>
                            </Col>
                            <Col md={4} xs="12">
                              <div className="form-group">
                                <label className="text-label">Mobile Number : </label>
                                <input type="number" className="form-control" name="mobileNumber" onChange={this.onChange}
                                  value={form.mobileNumber}
                                ></input>
                                <p className="reg-error">{this.state.mobileNumberError}</p>

                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={4} xs="12">
                              <div className="form-group">
                                <label className="text-label">Usertype : </label>
                                <div className="form-group">
                                  <select className="form-control" id="dropdown" value={form.userType} onChange={this.handleDropdownChange}>
                                    <option>User Type</option>
                                    <option value="Student">Student</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Admin">Administrator</option>
                                  </select>
                                  <p className="reg-error">{this.state.userTypeError}</p>

                                </div>
                              </div>
                            </Col>
                            {indexDiv === true && (
                              <Col md={4} xs="12">
                                <div className="form-group">
                                  <label className="text-label">Index Number : </label>
                                  <input type="text" className="form-control" name="indexNumber" onChange={this.onChange}
                                    value={form.indexNumber}
                                  ></input>
                                  <p className="reg-error">{this.state.indexNumberError}</p>

                                </div>
                              </Col>
                            )}
                            {indexDiv === true && (
                              <Col md={4} xs="12">
                                <div className="form-group">
                                  <label className="text-label">Registration Number : </label>
                                  <input type="text" className="form-control" name="regNumber" onChange={this.onChange}
                                    value={form.regNumber}
                                  ></input>
                                  <p className="reg-error">{this.state.regNumberError}</p>

                                </div>
                              </Col>
                            )}
                            {indexDiv === true && (
                              <Col md={4} xs="12">
                                <div className="form-group">
                                  <label className="text-label">Course : </label>
                                  <div className="form-group">
                                    <select className="form-control" id="dropdown" value={form.courseType} onChange={this.courseChange}>
                                      <option>Select Course</option>
                                      {this.state.courses.map((data) => {
                                        return (
                                          <option value={data.courseCode} key={data._id}>{data.courseName}</option>
                                        )
                                      })}
                                    </select>
                                    <p className="reg-error">{this.state.courseTypeError}</p>
                                    <span className="course-reg">
                                      <Link to="/adminhome/registration/course">Course Registration</Link>
                                    </span>
                                  </div>
                                </div>
                              </Col>
                            )}
                            <Col md={4} xs="12">
                              <label className="text-label">Birthday : </label>
                              <div className="form-group">
                                <DatePicker
                                  className="form-control"
                                  selected={this.state.startDate}
                                  onChange={this.onChangeDate}
                                  dateFormat="yyyy-MM-dd"
                                />
                              </div>
                            </Col>
                          </Row>

                          <div className="form-group">
                            <button
                              className="btn btn-info my-4 " style={{ width: "100%" }}
                              type="submit"
                            >Register Now </button>
                          </div>
                        </form>
                      </div>
                    </Tab>

                  </Tabs>

                </div>
              </div>

            </Col>
          </Row>
        </div>
        <Footer />

      </div>
    );
  }
}
