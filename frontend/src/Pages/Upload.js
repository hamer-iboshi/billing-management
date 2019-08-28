import React from 'react';
import { Row, Col, Card, Button, Icon } from 'react-materialize';

function Upload() {
  return (
    <div className="App">
        <Row>
            <Col s={12}>
                <Card>
                <form action="http://localhost:3333/" method="post" enctype="multipart/form-data">
                    <input type="file" name="contracts" />
                    <input type="file" name="delayed_installments" />
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