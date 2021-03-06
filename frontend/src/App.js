import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Registration from './components/admin/Registration'
import Login from './components/Login';

/*********************************************************************************** */
import AdminHome from './components/admin/AdminHome';
import ViewUsers from './components/admin/ViewUsers';
import CreateProject from './components/admin/CreateProject';
import ProjectTypes from './components/admin/ProjectTypes';
import CourseRegistration from './components/admin/CourseRegistration';
import Profile from "./components/shared/Profile";
import EditProfile from "./components/admin/EditUser";
import ViewMailBox from "./components/admin/ViewMailBox";
import CustomRegistration from "./components/shared/CustomRegistration";

import CoordinatorHome from './components/coordinator/CoordinatorHome';
import CreateGroup from './components/coordinator/CreateGroups'
import ProjectGroups from './components/coordinator/ProjectGroups'
import GroupData from './components/coordinator/GroupData/GroupData';
import AssignSupervisor from './components/coordinator/AssignSupervisors';
import SupervisorData from './components/coordinator/SupervisorData/SupervisorData';
import BiWeekly from './components/coordinator/ProjectData/BiWeekly';
import Groups from './components/coordinator/ProjectData/Groups';
import Submission from './components/coordinator/ProjectData/Submission';
import ViewSubmission from './components/coordinator/ProjectData/ViewSubmission';
import ViewBiweekly from './components/coordinator/ProjectData/ViewBiweekly';
// import SRS from './components/coordinator/ProjectData/SRS';
import Supervisors from './components/coordinator/ProjectData/Supervisors';
import GroupBiWeekly from './components/coordinator/GroupData/GroupSubmissions/BiWeekly';
import GroupPresentation from './components/coordinator/GroupData/GroupSubmissions/GroupPresentation';
import GroupProposal from './components/coordinator/GroupData/GroupSubmissions/Proposal';
import PresentationFeedback from './components/coordinator/PresentationFeedback';

import SupervisorHome from './components/supervisor/SupervisorHome';
import GroupDataSupervisor from './components/supervisor/GroupData/GroupData';
import ViewMeetingsSupervisor from './components/supervisor/Meetings/ViewMeetings';
import ViewProgressSupervisor from './components/supervisor/Progress/ViewProgress';
import ViewRequest from './components/supervisor/ViewRequest';
import SupervisorBiWeeklyView from './components/supervisor/BiWeekly';
import GroupPresentationSupervisor from './components/supervisor/GroupData/GroupPresentation';


import NoticeView from './components/shared/NoticeView';

import StudentHome from './components/student/StudentHome';
import ViewProjects from "./components/student/ViewProjects";
import ViewProject from "./components/student/ViewProject";
import RequestSupervisor from "./components/student/RequestSupervisor";
import Tasks from "./components/student/progress/Tasks";
import ViewMeeting from "./components/student/ViewMeeting";
import SubmisionView from "./components/student/SubmisionView";
import SubmisionPanel from "./components/student/SubmitPanal";
import BiweeklyView from "./components/student/BiweeklyView";
import BiweeklySubmissionPanel from "./components/student/BiweeklySubmissionPanel";
import GroupPresentationStudent from "./components/student/PresentaionFeedback";

import Notice from './components/shared/Notice'
import GroupChat from "./components/shared/GroupChat/GroupChat";
import ViewTask from "./components/student/progress/ViewTask";
import GroupNotification from "./components/student/formgroups/GroupNotification";
import FormGroups from "./components/student/formgroups/FormGroups";
import CoordinatorNotifications from "./components/coordinator/Notifications/CoordinatorNotifications";
import SupervisorNotifications from "./components/supervisor/Notifications/SupervisorNotifications";
import GivePresentationFeedback from "./components/supervisor/PresentationFeedback/GivePresentationFeedback";
import BiWeekComments from "./components/supervisor/Notifications/BiWeekComments";

require('dotenv').config();


function App() {
  return (
    <React.Fragment>
      {/* <Navbar /> */}

      <Router>
        <Switch>
          <Route exact path='/' component={Login}></Route>
          <Route exact path='/customregistration' component={CustomRegistration}></Route>
          {/* ======================= Admin Routes =============================== */}
          <Route exact path='/adminhome' component={AdminHome}></Route>
          <Route exact path='/adminhome/registration' component={Registration}></Route>
          <Route exact path="/profile" component={Profile}></Route>
          <Route exact path="/editprofile/:id" component={EditProfile}></Route>

          <Route exact path='/adminhome/viewusers' component={ViewUsers}></Route>
          <Route exact path='/adminhome/viewmailbox' component={ViewMailBox}></Route>
          <Route exact path='/adminhome/createproject' component={CreateProject}></Route>
          <Route exact path='/adminhome/projecttypes' component={ProjectTypes}></Route>
          <Route exact path='/adminhome/registration/course' component={CourseRegistration}></Route>
          <Route exact path='/shared/notice' component={Notice}></Route>

          {/* =================== Coordinator Routes ============================== */}
          <Route exact path='/coordinatorhome' component={CoordinatorHome}></Route>
          <Route exact path='/coordinatorhome/createGroups' component={CreateGroup}></Route>
          <Route exact path='/coordinatorhome/projectGroups' component={ProjectGroups}></Route>
          <Route exact path='/shared/notice' component={Notice}></Route>
          <Route exact path='/shared/noticeView' component={NoticeView}></Route>
          <Route exact path='/coordinatorhome/projectGroups' component={ProjectGroups}></Route>
          <Route path='/coordinatorhome/assignSupervisors' exact component={AssignSupervisor}></Route>
          <Route path='/coordinatorhome/supervisorData/:id' component={SupervisorData}></Route>

          <Route path='/coordinatorhome/projectdata/BiWeekly/:id' component={BiWeekly}></Route>
          <Route path='/coordinatorhome/projectdata/Groups/:id' component={Groups}></Route>
          <Route path='/coordinatorhome/projectdata/submission/:id' component={Submission}></Route>
          <Route path='/coordinatorhome/projectdata/viewsubmission/:id' component={ViewSubmission}></Route>
          <Route path='/coordinatorhome/projectdata/viewbiweekly/:id' component={ViewBiweekly}></Route>


          <Route path='/coordinatorhome/presentationfeedback' component={PresentationFeedback}></Route>
          <Route path='/coordinatorhome/projectdata/Supervisors/:id' component={Supervisors}></Route>

          <Route path='/coordinatorhome/groupData/:id' component={GroupData}  ></Route>
          <Route path='/coordinatorhome/gdata/proposal/:id' component={GroupProposal}></Route>
          <Route path='/coordinatorhome/gdata/presentation/:id' component={GroupPresentation}></Route>
          <Route path='/coordinatorhome/gdata/biweekly/:id' component={GroupBiWeekly}></Route>
          <Route path='/coordinatorhome/notifications' component={CoordinatorNotifications}></Route>

          {/* ================== Supervisor Routes========================= */}
          <Route exact path='/supervisorhome' component={SupervisorHome}></Route>
          <Route path='/supervisorhome/groupData/:id' component={GroupDataSupervisor}></Route>
          <Route path='/supervisorhome/viewMeetings' component={ViewMeetingsSupervisor}></Route>
          <Route path='/supervisorhome/viewProgress' component={ViewProgressSupervisor}></Route>

          <Route exact path='/shared/noticeView' component={NoticeView}></Route>
          <Route exact path='/supervisorhome/viewRequest' component={ViewRequest}></Route>

         
          <Route path='/supervisorhome/biweeklyview' component={SupervisorBiWeeklyView}></Route>
          <Route path='/supervisorhome/presentation/:id' component={GroupPresentationSupervisor}></Route>
          <Route exact path='/supervisorhome/notifications' component={SupervisorNotifications}></Route>
          <Route exact path='/supervisorhome/notifications/biweekcomments/:id' component={BiWeekComments}></Route>
          <Route exact path='/supervisorhome/givepresentationfeedback' component={GivePresentationFeedback}></Route>


          {/* =================== Student Routes ============================== */}
          <Route exact path='/studenthome' component={StudentHome}></Route>
          <Route exact path='/studenthome/viewprojects' component={ViewProjects}></Route>
          <Route exact path='/studenthome/viewproject' component={ViewProject}></Route>
          <Route exact path='/studenthome/viewproject/progresstasks' component={Tasks}></Route>
          <Route exact path='/studenthome/viewproject/progresstasks/viewtask' component={ViewTask}></Route>
          <Route exact path='/shared/notice' component={NoticeView}></Route>
          <Route exact path='/studenthome/viewproject/requestsupervisor' component={RequestSupervisor}></Route>
          <Route exact path='/student/viewMeeting' component={ViewMeeting}></Route>
          <Route exact path='/studenthome/notifications' component={GroupNotification}></Route>
          <Route exact path='/studenthome/formgroups/:projectId' component={FormGroups}></Route>
          <Route exact path='/studenthome/submisionview/:id' component={SubmisionView}></Route>
          <Route exact path='/studenthome/submisionview/submisionpanal/:id' component={SubmisionPanel}></Route>
          <Route exact path='/studenthome/biweeklyview/:id' component={BiweeklyView}></Route>
          <Route exact path='/studenthome/biweeklysubmissionpanel/:id' component={BiweeklySubmissionPanel}></Route>
          <Route exact path='/studenthome/viewFeedback' component={GroupPresentationStudent}></Route>


          <Route path='/studenthome/chat/:id' component={GroupChat}></Route>

        </Switch>
      </Router>
    </React.Fragment >
  );
}

export default App;
