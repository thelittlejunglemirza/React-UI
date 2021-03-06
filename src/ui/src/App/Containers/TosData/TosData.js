// External
import React, { Component } from 'react';
import { inject, Provider, observer } from "mobx-react";
import { Grid, Row, Col, Tabs,Tab} from 'react-bootstrap';
// Components
import RequestHandler from '../../Services/RequestHandler';
import Loadbar from "../../Components/Loadbar/Loadbar"
import SideMenu from "../../Components/SideMenu/SideMenu"
import TosText from "../../Components/TosText/TosText"
import RiskAssessment from "../../Components/RiskAssessment/RiskAssessment"
import PriorityMarker from "../../Components/PriorityMarker/PriorityMarker"
import PriorityList from "../../Components/PriorityList/PriorityList"
import Overview from "../../Components/Overview/Overview"
import DiffTool from "../../Components/DiffTool/DiffTool"
import TopNav from "../../Components/TopNav/TopNav"
// stores
import TosDataStore from '../../Stores/TosDataStore'
// Style
import './TosData.css'

/*
* @ Des:
*     View of search results based on search url variable in the path
*     (ie: http://<someDomain>/search/<var url>).
*/

@inject('globalStore')
@inject('routing')
@observer
class TosData extends Component {
  constructor(props) {
    super(props)
    this.store = TosDataStore
    this.globalStore = this.props.globalStore

    // set the id based on url
    this.store.set_id(this.props.match.params.id)
    // get data for that id
    this.store.getIdData();
    // anything below in constructor may not have access to data since getIdData
    // is async

    // routing
    const { push } = this.props.routing;
    this.push = push;

    this.state={
      key:1
    }

  }

  componentWillMount() {
    // enable clicking on side menu
    this.globalStore.set_SideMenuIsClickable(true);
    this.globalStore.set_current_tab('Overview');

    // define tabs shown
    this.globalStore.set_tabs([
      'Overview',
      'Priority Marker',
      'Risk Assessment'
    ])

  }
  getToSAssessmentPage(unique_id, level) {
    if (level === "api") {
      RequestHandler.getVersionsForUrl(unique_id)
      .then((resp) => {
        var id = resp.data.versions[0]._id;
        this.push('/tos/' + id);
      })
      .catch((err) => {
        alert('error from getToSAssessmentPage()' + err);
      });
    }else if (level === "project") {
      RequestHandler.getFilteredApis(unique_id)
      .then((resp) => {
        var id = resp.data[0]._id;
        this.push('/api/' + id);
      })
      .catch((err) => {
        alert('error from getToSAssessmentPage()' + err);
      });
    }
  }

  handleSelect(key) {
    this.setState({ key });
  }

  renderMain() {

      if(this.state.key === 1) {
        return(
          <span>
            <Row className="noMargin">
              <Col xs={1}  md={1} className="noPadding">{/* Spacing */}</Col>
              <Col xs={10} md={10} className="noPadding-withMargin"><Overview/></Col>
              <Col xs={1} md={1} className="noPadding">{/* Spacing */}</Col>
            </Row>
            <Row className="noMargin grey-row">
              <Col xs={1}  md={1} className="noPadding">{/* Spacing */}</Col>
              <Col xs={10} md={10} className="noPadding"><DiffTool/></Col>
              <Col xs={1} md={1} className="noPadding">{/* Spacing */}</Col>
            </Row>
          </span>
        )
      }
      else if (this.state.key === 2) {
        return(
          <Row className="noMargin">
            <Col xs={6}  md={8} className="noPadding"><PriorityMarker/></Col>
            <Col xs={6} md={4} className="noPadding"><TosText dim={this.globalStore.dim}/></Col>
          </Row>
        )
      }
      else{return(
        <Row className="noMargin">
          <Col xs={6}  md={8} className="noPadding"><PriorityList parent='RA'/></Col>
          <Col xs={6} md={4} className="noPadding"><RiskAssessment/></Col>
        </Row>
      )}
  }


  render() {

    if(this.store.loading === true) {
      return(
          <div>
            Loading...
          </div>
      )
    }
    else{
      // set project breadcrumb
      this.globalStore.set_breadcrumb(this.store.data.url,"tos")
      this.globalStore.set_idBreadcrumb(this.store.data._id,"tos")


      // ~@~@~@~@~ FINAL RETURN ~@~@~@~@~ //
      return(
            <Grid fluid className="noPadding">
              <Provider globalStore={this.globalStore} localStore={this.store}>
                <Row className="show-grid">
                  <Col xs={12} md={12} className="noMargin">
                    <Row className="noMargin" style={{backgroundColor: "var(--green)",height:"100%"}}>
                      <Col xs={3} md={2} className="noPadding">
                        <p >&nbsp;</p>
                      </Col>
                      <Col xs={9} md={10} className="noPadding" >

                        <Tabs
                            className="topTab"
                            activeKey={this.state.key}
                            onSelect={(key) => this.handleSelect(key)}
                            // id="controlled-tab-example"
                          >
                            <Tab eventKey={1} title="Summary"></Tab>
                            <Tab eventKey={2} title="Priority Marker Tool"></Tab>
                            <Tab eventKey={3} title="Risk Assessment Tool"></Tab>
                          </Tabs>

                      </Col>
                    </Row>
                    <Row className="noMargin">
                      <Col xs={3} md={2} className="noPadding">
                        <SideMenu/>
                      </Col>
                      <Col xs={9} md={10} className="noPadding">

                        {this.renderMain()}

                      </Col>
                    </Row>

                  </Col>
                </Row>
              </Provider>
            </Grid>
      )
    }
  }

  //
  // render() {
  //   if(this.store.loading === true) {
  //     return(
  //         <div className="SearchResults">
  //           <Loadbar/>
  //         </div>
  //     )
  //   }else {
  //     this.globalStore.set_breadcrumb(this.store.data.url,"tos")
  //     this.globalStore.set_idBreadcrumb(this.store.data._id,"tos")
  //
  //     this.store.getVersionData();
  //     let content = <div>err</div>
  //
  //     // ~@~@~@~@~ CONDITIONAL RENDERS FOR TABS ~@~@~@~@~ //
  //     // overview tab
  //     if (this.globalStore.current_tab === 'Overview'){
  //       content =   <div className="TosData-content-components-overview" >
  //                     <Overview/>
  //                     <DiffTool/>
  //                   </div>
  //     }
  //     // priority marker tab
  //     else if (this.globalStore.current_tab === 'Priority Marker'){
  //       content =   <div className="TosData-content-components-priorityMarker">
  //                       <PriorityMarker/>
  //                       <div className="TosData-TosText">
  //                         <TosText dim={this.globalStore.dim}/>
  //                       </div>
  //                   </div>
  //     }
  //     // risk assesment tab
  //     else if (this.globalStore.current_tab === 'Risk Assessment'){
  //       content =   <div className="TosData-content-components-riskAssesment">
  //                       <div className='assessmentList'  id='scroll-1' >
  //                         <PriorityList parent='RA'/>
  //                       </div>
  //                       <div className="assesmentTextBox" >
  //                         <RiskAssessment/>
  //                       </div>
  //                   </div>
  //     }
  //
  //     // ~@~@~@~@~ FINAL RETURN ~@~@~@~@~ //
  //     return(
  //       <div className='TosData-container'>
  //         <Provider globalStore={this.globalStore} localStore={this.store}>
  //             <div className='Tos-Window'>
  //               <div className="TosData-SideMenu-cont">
  //                 <SideMenu/>
  //               </div>
  //               <div className='Tos-Data-and-TopNav'>
  //                 <TopNav/>
  //                 <div style={{maxHeight:this.globalStore.dim.height}} className="TosData-components">
  //                   {content}
  //                 </div>
  //               </div>
  //             </div>
  //         </Provider>
  //       </div>
  //     )
  //   }
  // }
}

export default TosData;
