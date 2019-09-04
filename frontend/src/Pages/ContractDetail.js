import React,  { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import { Card } from 'react-materialize';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import api from '../services/api'

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
    marginTop: 20,
  },
  input: {
    display: 'none',
  },
}));

export default function ContractDetail({ match, history }) {
  const classes = useStyles();
  const contractId = match.params.id;
  const [contract, setContract] = useState([]);
  const [delayedInstallments, setDelayedInstallments] = useState([]);
  const [bankSlips, setBankSlips] = useState([]);
  const [selectedDelayedInstallments, setSelectedDelayedInstallments] = useState([]);
  const [selectedBankSlips, setSelectedBankSlips] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await api.get(`/${contractId}/contract`);
      setContract(response.data.contract);
      setDelayedInstallments(response.data.delayed_installments);
      setBankSlips(response.data.bank_slips);
    }
    loadData();
  });

  function handleSelectClickDelayedInstallment(event, id) {
    if (selectedDelayedInstallments.includes(id)) {
      let newSelecteds = selectedDelayedInstallments;
      newSelecteds = newSelecteds.filter(item => item !== id);
      setSelectedDelayedInstallments(newSelecteds);
      return;
    }
    let newSelecteds = selectedDelayedInstallments;
    newSelecteds.push(id);
    setSelectedDelayedInstallments(newSelecteds);
  }

  function handleSelectClickBankSlips(event, id) {
    if (selectedBankSlips.includes(id)) {
      let newSelecteds = selectedBankSlips;
      newSelecteds = newSelecteds.filter(item => item !== id);
      setSelectedBankSlips(newSelecteds);
      return;
    }
    let newSelecteds = selectedBankSlips;
    newSelecteds.push(id);
    setSelectedBankSlips(newSelecteds);
  }

  function handleScheduleNewBank(){
    let selectedInstallments = [];
    for(let i in delayedInstallments){
      if(selectedDelayedInstallments.includes(delayedInstallments[i].delayed_installment._id)){
        selectedInstallments.push(delayedInstallments[i]);
      }
    }
    console.log(selectedInstallments.length);
    if(selectedInstallments.length == 0) return;
    history.push({
      pathname: `/bank_slip/${contractId}`,
      data: {
        'delayed_installments' : selectedInstallments
      }
    });
  }

  async function handleMarkAsPaid(){
    let response = [];
    await selectedBankSlips.forEach(element => {
       response.push(api.post(`/${element}/payment`));
    });
    history.push(`/`);
  }

  return (
    <div id="contract_detail">
      <Card
        title={"Contract details #"+contract._id}
      >
        <Paper className={classes.root}>   
          <Button variant="outlined" className={classes.button} href="/">Contracts Listing</Button> 
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell align="right">external_id</TableCell>
                <TableCell align="left">{contract._id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">custumer_name</TableCell>
                <TableCell align="left">{contract.customer_name}</TableCell>    
              </TableRow>
              <TableRow>
                <TableCell align="right">customer_email</TableCell>
                <TableCell align="left">{contract.customer_email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">customer_cpf</TableCell>
                <TableCell align="left">{contract.customer_cpf}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">loan_value</TableCell>
                <TableCell align="left">{contract.loan_value}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">payment_term</TableCell>
                <TableCell align="left">{contract.payment_term}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">reality_address</TableCell>
                <TableCell align="left">{contract.realty_address}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Card>
      <Card title={"Delayed installments"}>
        <Paper className={classes.root}>    
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="right">installment_index</TableCell>
                <TableCell align="right">due_date</TableCell>
                <TableCell align="right">days_in_delay</TableCell>
                <TableCell align="right">value</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {delayedInstallments.map(installment => (
                <TableRow key={installment.delayed_installment._id}>
                  <TableCell component="th"  align="right" scope="row">
                    {installment.delayed_installment.installment_index}
                  </TableCell>
                  <TableCell align="right" scope="row">
                    {new Date(installment.delayed_installment.due_date).getFullYear()+"-"+ new Date(installment.delayed_installment.due_date).getMonth()+"-"+ new Date(installment.delayed_installment.due_date).getDate()}
                  </TableCell>
                  <TableCell align="right">{installment.days_in_delay}</TableCell>
                  <TableCell align="right">{installment.delayed_installment.value}</TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedDelayedInstallments.includes(installment.delayed_installment._id) ? true : false}
                      onClick={e => handleSelectClickDelayedInstallment(e, installment.delayed_installment._id)}
                      inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Button variant="outlined" className={classes.button} onClick={handleScheduleNewBank}>Schedule new bank</Button> 
      </Card>
      <Card title={"Banks slips"}>
        <Paper className={classes.root}>    
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="right">due_date</TableCell>
                <TableCell align="right">value</TableCell>
                <TableCell align="right">status</TableCell>
                <TableCell align="right">days_in_delay</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankSlips.map(bank_slip => (
                <TableRow key={bank_slip._id}>
                  <TableCell align="right" scope="row">
                    {new Date(bank_slip.due_date).getFullYear()+"-"+ new Date(bank_slip.due_date).getMonth()+"-"+ new Date(bank_slip.due_date).getDate()}
                  </TableCell>
                  <TableCell align="right">{bank_slip.value}</TableCell>
                  <TableCell align="right" scope="row">{bank_slip.status}</TableCell>
                  <TableCell align="right">
                  { 
                    (new Date().getTime() <= new Date(bank_slip.due_date)) ? 0 : Math.trunc(new Date(new Date().getTime() - new Date(bank_slip.due_date)).getTime() / (1000 * 3600 * 24)) 
                  }
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedBankSlips.includes(bank_slip._id) ? true : false}
                      onClick={e => handleSelectClickBankSlips(e, bank_slip._id)}
                      inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Button variant="outlined" className={classes.button} onClick={handleMarkAsPaid}>Mark as paid</Button>
      </Card>
    </div>
  );
}