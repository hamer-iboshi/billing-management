import React, { useState } from 'react';
import { Row, Col, Card, Button, Icon } from 'react-materialize';
import api from '../services/api';

function Upload({ history }) {
  const [contracts, setContracts] = useState('');
  const [delayedInstallments, setDelayedInstallments] = useState('');

  async function handleSubmit(e){
    console.log(e.target);
    e.preventDefault();
    const response = await api.post('/', {
        contracts,
        delayedInstallments
    });
    history.push('/contract');
  }
// action="http://localhost:3333/" method="post" encType="multipart/form-data" 
  return (
    <div className="App">
        <Row>
            <Col s={12}>
                <Card>
                <form onSubmit={handleSubmit}>
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Contracts File</span>
                            <input type="file" name="contracts" value={contracts} onChange={ e => setContracts(e.target.value)}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                    </div>
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Delayed Installments File</span>
                            <input type="file" name="delayed_installments" value={delayedInstallments} onChange={ e => setDelayedInstallments(e.target.value)}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                    </div>
                    <Button  waves="light" type="submit" name="action" style={{marginRight: '5px'}}>
                        Upload
                        <Icon left></Icon>
                    </Button>
                </form>      
                </Card>    
            </Col>
        </Row>
    </div>
  );
}

export default Upload;