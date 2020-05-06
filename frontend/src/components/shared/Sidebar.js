import React, { Component } from "react";
import "../../Css/shared/sidebar.css";
import { Link } from "react-router-dom";

export default class sidebar extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="side-row-div">
          <Link to={"/registration"}>
            <div className="row">
              <div className="col-md-2 side-icn">
                <p>(*)</p>
              </div>
              <div className="col-md-10 side-txt">
                <p>User Registration</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}