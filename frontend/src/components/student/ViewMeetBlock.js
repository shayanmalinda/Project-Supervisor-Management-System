import React, { Component } from 'react';
import { Col, Row } from 'reactstrap'
import Card from "@material-ui/core/Card";
import '../../css/supervisor/SupervisorHome.css';

class viewMeetBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            meetData: this.props.data
        }
        console.log(this.state.meetData);

    }
    render() {
        const { meetData } = this.state;
        let supervisorProjectList = meetData.length > 0
            && meetData.map((item, i) => {
                return (
                    <Col md={4} xs={12} sm={6} key={item._id} style={{ marginBottom: "20px" }}>
                        <Card className='sh-proj-card' >
                            <div className="container" >
                                <Row className="shpc-topic-div">
                                    <p className="shpc-topic">{item.groupId}  {item.groupName}</p>
                                </Row>


                                <Row>
                                    <p className="shpc-head">Purpose</p>
                                </Row>
                                <Row>
                                    <p className="shpc-list">{item.purpose}</p>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Row>
                                            <p className="shpc-head">Date</p>
                                        </Row>
                                        <Row>
                                            <p className="shpc-list">{item.date}</p>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <p className="shpc-head">Time</p>
                                        </Row>
                                        <Row>
                                            <p className="shpc-list">{item.time}</p>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <p className="shpc-head">Supervisor</p>
                                </Row>
                                <Row>
                                    <p className="shpc-list">{item.supervisor}</p>
                                </Row>

                            </div>
                        </Card>
                    </Col>
                )




            })

        return (
            <div className="row">

                {supervisorProjectList}
            </div>
        );

    }
}

export default viewMeetBlock;