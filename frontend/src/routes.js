import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import { Row, Col } from 'react-materialize';

import Upload from './Pages/Upload';
import Home from './Pages/Home';
import ContractDetail from './Pages/ContractDetail';

export default function Routes(){
    return (
        <Row>
            <Col s={12}>
                    <BrowserRouter>
                        <Route path="/" exact component={Upload}/>
                        <Route path="/contract" component={Home}/>
                        <Route path="/contract/:id" component={ContractDetail}/>
                    </BrowserRouter>
            </Col>
        </Row>
    );
}