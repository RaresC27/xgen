import React, { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Link from 'next/link';

const History = () => {
    let historyCalls;
    const [hCalls, setHCalls] = useState();
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState();

    if (typeof window !== 'undefined') {
        historyCalls = localStorage.getItem('doneEm');
        historyCalls = JSON.parse(historyCalls);
    }
    useEffect(() => {
        setHCalls(historyCalls);
    }, []);
    const [dispatch, setDispatch] = useState();
    const handleClick = (unitsSended) => {
        setDispatch(unitsSended);
        setOpen(true);

        console.log(unitsSended);
    };

    const handleClose = () => {
        setOpen(false);
        setDispatch(null);
        setTime(null);
    };
    return (
        <div style={{ paddingTop: '10px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <Link
                    href={{
                        pathname: '/calls',
                    }}
                >
                    <Button
                        variant="contained"
                        style={{ background: '#22577A' }}
                    >
                        Calls
                    </Button>
                </Link>
            </div>
            <TableContainer component={Paper} style={{ borderRadius: '30px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow style={{ background: '#C7F9CC' }}>
                            <TableCell align="right">City</TableCell>
                            <TableCell align="right">County</TableCell>
                            <TableCell align="right">Latitude</TableCell>
                            <TableCell align="right">Longitude</TableCell>
                            <TableCell align="right">INFO</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hCalls &&
                            hCalls.map((call) => (
                                <TableRow
                                    key={Math.floor(
                                        (1 + Math.random()) * 0x10000
                                    )
                                        .toString(16)
                                        .substring(1)}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell align="right">
                                        {call.city}
                                    </TableCell>
                                    <TableCell align="right">
                                        {call.county}
                                    </TableCell>
                                    <TableCell align="right">
                                        {call.latitude}
                                    </TableCell>
                                    <TableCell align="right">
                                        {call.longitude}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            style={{ background: '#38A3A5' }}
                                            variant="contained"
                                            endIcon={<InfoOutlinedIcon />}
                                            onClick={() => {
                                                setTime(call.time);
                                                handleClick(call.unitsSended);
                                            }}
                                        >
                                            Info
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    style={{ textAlign: 'center' }}
                >
                    Dispatched Units
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 100 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">
                                        Units Type
                                    </TableCell>
                                    <TableCell align="right">County</TableCell>
                                    <TableCell align="right">City</TableCell>
                                    <TableCell align="right">
                                        Dispatched Units
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dispatch &&
                                    dispatch.map((obj) => (
                                        <TableRow
                                            key={Math.floor(
                                                (1 + Math.random()) * 0x10000
                                            )
                                                .toString(16)
                                                .substring(1)}
                                            sx={{
                                                '&:last-child td, &:last-child th':
                                                    { border: 0 },
                                            }}
                                        >
                                            <TableCell align="right">
                                                {obj.type}
                                            </TableCell>
                                            <TableCell align="right">
                                                {obj.county}
                                            </TableCell>
                                            <TableCell align="right">
                                                {obj.city}
                                            </TableCell>
                                            <TableCell align="right">
                                                {obj.trucks}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {time && (
                        <p style={{ textAlign: 'center' }}>
                            Units were dispatched at {time}
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: 'red' }} onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default History;
