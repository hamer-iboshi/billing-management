import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import { Row, Col } from 'react-materialize';

import Upload from './Pages/Upload';
import Home from './Pages/Home';
import ContractDetail from './Pages/ContractDetail';
import BankSlipSchedule from './Pages/BankSlipSchedule';

export default function Routes(){
    return (
        <Row>
            <Col s={12}>
                    <BrowserRouter>
                        <Route path="/upload" exact component={Upload}/>
                        <Route path="/" exact component={Home}/>
                        <Route path="/contract/:id" component={ContractDetail}/>
                        <Route path="/bank_slip/:id" component={BankSlipSchedule}/>
                    </BrowserRouter>
            </Col>
        </Row>
    );
}