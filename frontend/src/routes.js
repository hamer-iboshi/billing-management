import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Upload from './Pages/Upload';
import Home from './Pages/Home';
import ContractDetail from './Pages/ContractDetail';

export default function Routes(){
    return (
        <BrowserRouter>
            <Route path="/" exact component={Upload}/>
            <Route path="/contract" component={Home}/>
            <Route path="/contract/:id" component={ContractDetail}/>
        </BrowserRouter>
    );
}