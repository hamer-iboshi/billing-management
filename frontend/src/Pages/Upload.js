import React, { useState } from 'react';
import { Row, Col, Card } from 'react-materialize';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import api from '../services/api';

function Upload({ history }) {
  const [contracts, setContracts] = useState(React.useRef());
  const [delayedInstallments, setDelayedInstallments] = useState(React.useRef());

  async function handleSubmit(e){
    e.preventDefault();
    const data = new FormData();
    data.append('contracts', (contracts ? contracts : ''));
    data.append('delayed_installments', (delayedInstallments ? delayedInstallments : ''));
    console.log(contracts,delayedInstallments);
    const response = await api.post('/',data);
    history.push('/');
  }
// action="http://localhost:3333/" method="post" encType="multipart/form-data" 
  return (
    <div className="App">
        <Row>
            <Col s={12}>
                <Card>
                    <Button variant='outlined' href='/'>
                        Contracts Listing
                    </Button>
                    <form onSubmit={handleSubmit}>
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>Contracts File</span>
                                <input type="file" name="contracts" onChange={ e => setContracts(e.target.files[0])}/>
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                        </div>
                        <div className="file-field input-field">
                            <div className="btn">
                                <span>Delayed Installments File</span>
                                <input type="file" name="delayed_installments" onChange={ e => setDelayedInstallments(e.target.files[0])}/>
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                        </div>
                        <Button variant='outlined' color='primary' type="submit" name="action" style={{marginRight: '5px'}}>
                            Upload
                            <CloudUploadIcon />
                        </Button>
                    </form>      
                </Card>    
            </Col>
        </Row>
    </div>
  );
}

export default Upload;