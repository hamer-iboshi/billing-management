import React,  { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import { Card } from 'react-materialize';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import api from '../services/api'
import './Home.css';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

export default function Home({ history }) {
  const classes = useStyles();
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    async function loadContracts() {
      const response = await api.get('/');
      setContracts(response.data);
    }

    loadContracts();
  });

  async function destroyContract(id){
    const response = await api.post('/'+id+'/destroy');
  }

  function showContract(id){
    history.push(`/contract/${id}`);
  }

  return (
    <Card
      title="Contracts listing"
    >
      <div className="ButtonDataImport">
        <Button variant='outlined' href='/upload' className={classes.button}>
          Data import
        </Button>
      </div>
      <Paper className={classes.root}>    
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>external_id</TableCell>
              <TableCell align="right">custumer_name</TableCell>
              <TableCell align="right">customer_email</TableCell>
              <TableCell align="right">customer_cpf</TableCell>
              <TableCell align="right">loan_value</TableCell>
              <TableCell align="right">payment_term</TableCell>
              <TableCell align="right">reality_address</TableCell>
              <TableCell align="right">actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map(contract => (
              <TableRow key={contract._id}>
                <TableCell component="th" scope="row">
                  {contract._id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {contract.customer_name}
                </TableCell>
                <TableCell align="right">{contract.customer_email}</TableCell>
                <TableCell align="right">{contract.customer_cpf}</TableCell>
                <TableCell align="right">{contract.loan_value}</TableCell>
                <TableCell align="right">{contract.payment_term}</TableCell>
                <TableCell align="right">{contract.realty_address}</TableCell>
                <TableCell align="right">
                <Button variant="contained" color="primary" className={classes.button} href={"/contract/"+contract._id}>
                  View
                </Button>
                <Button variant="contained" color="secondary" className={classes.button} onClick={() => destroyContract(contract._id)}>
                  Delete
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Card>
  );
}