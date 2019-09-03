import React,  { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import { Card, DatePicker } from 'react-materialize';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

export default function BankSlipSchedule({ match, location }) {
  const classes = useStyles();
  const [contract, setContract] = useState([]);
  const [selectedDelayedInstallments, setSelectedDelayedInstallments] = useState(location.data ? location.data.delayed_installments : []);
  const [selectedBankSlips, setSelectedBankSlips] = useState([]);
  const contractId = match.params.id;

  function handleSchedule(event, id) {
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

  return (
    <div id="bank_slip_schedule">
      <Card title={"Bank slip schedule for #"+contract._id}>
        <Paper className={classes.root}>    
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="right">installment_index</TableCell>
                <TableCell align="right">due_date</TableCell>
                <TableCell align="right">days_in_delay</TableCell>
                <TableCell align="right">value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedDelayedInstallments.map(installment => (
                <TableRow key={installment.delayed_installment._id}>
                  <TableCell component="th"  align="right" scope="row">
                    {installment.delayed_installment.installment_index}
                  </TableCell>
                  <TableCell align="right" scope="row">
                    {new Date(installment.delayed_installment.due_date).getFullYear()+"-"+ new Date(installment.delayed_installment.due_date).getMonth()+"-"+ new Date(installment.delayed_installment.due_date).getDate()}
                  </TableCell>
                  <TableCell align="right">{installment.days_in_delay}</TableCell>
                  <TableCell align="right">{installment.delayed_installment.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <form onSubmit={handleSchedule}>
          <div className="input-field col s6">
            <input placeholder="5%" id="fee_value" type="number" className="validate"/>
            <label htmlFor="fee_value">Fee Value</label>
          </div>
          <div className="input-field col s6">
            <input placeholder="1%" id="interest_value" type="number" className="validate"/>
            <label htmlFor="interest_value">Interest Value</label>
          </div>
          <div className="input-field s6">
            <DatePicker 
              format="mm dd yyyy"
              minDate={new Date()}
              placeholder={(new Date().getMonth())+"-"+(new Date().getDate())+"-"+(new Date().getFullYear())}
            />
          </div>
        </form>
        <Button variant="outlined" className={classes.button} onClick={handleSchedule}>Schedule</Button> 
      </Card>
    </div>
  );
}