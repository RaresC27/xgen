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
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import CircleIcon from '@mui/icons-material/Circle';
import Tooltip from '@mui/material/Tooltip';
import {
    getDistanceFromLatLonInKm,
    postData,
    getCurrentDate,
    calculatePriority,
    time_convert,
} from '../../utils/utils';
import { toast } from 'react-toastify';
import FireTruckOutlinedIcon from '@mui/icons-material/FireTruckOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import Link from 'next/link';

export default function Calls() {
    const [calls, setCalls] = useState();
    const [selectedCall, setSelectedCall] = useState(null);
    const [open, setOpen] = useState(false);
    const [trucksFrom, setTrucksFrom] = useState([]);

    let set_trucks_from = [];

    const verificaCalls = () => {
        let j = 1;
        fetch('http://localhost:5000/calls/queue').then((response) => {
            response.json().then((resJson) => {
                resJson.map((element) => {
                    element.id = j;
                    j += 1;
                });
                setCalls(resJson);
                if (resJson.length === calls.length) {
                    toast.warn('No calls in queue');
                }
            });
        });
    };
    useEffect(() => {
        let j = 1;
        fetch('http://localhost:5000/calls/queue').then((response) => {
            response.json().then((resJson) => {
                resJson.map((element) => {
                    element.id = j;
                    j += 1;
                });
                setCalls(resJson);
            });
        });
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTrucksFrom([]);
        setSelectedCall(null);
    };
    const handleSubmit = () => {
        trucksFrom.forEach(async (element) => {
            if (element.type === 'Police') {
                try {
                    const response = await postData(
                        'http://localhost:5000/police/dispatch',
                        {
                            sourceCounty: element.county,
                            sourceCity: element.city,
                            targetCounty: selectedCall.county,
                            targetCity: selectedCall.city,
                            quantity: element.trucks,
                        }
                    );
                    console.log('de aici', response);
                } catch (error) {
                    console.log('Error');
                }
            } else if (element.type === 'Ambulance') {
                try {
                    const response = await postData(
                        'http://localhost:5000/medical/dispatch',
                        {
                            sourceCounty: element.county,
                            sourceCity: element.city,
                            targetCounty: selectedCall.county,
                            targetCity: selectedCall.city,
                            quantity: element.trucks,
                        }
                    );
                    console.log(response);
                } catch (error) {
                    console.log('Error');
                }
            } else if (element.type === 'Fire') {
                try {
                    const response = await postData(
                        'http://localhost:5000/fire/dispatch',
                        {
                            sourceCounty: element.county,
                            sourceCity: element.city,
                            targetCounty: selectedCall.county,
                            targetCity: selectedCall.city,
                            quantity: element.trucks,
                        }
                    );
                    console.log(response);
                } catch (error) {
                    console.log('Error');
                }
            }
        });
        setCalls((current) =>
            current.filter((element) => element.id != selectedCall.id)
        );
        const doneCall = {
            city: selectedCall.city,
            county: selectedCall.county,
            id: selectedCall.id,
            latitude: selectedCall.latitude,
            longitude: selectedCall.longitude,
            unitsSended: trucksFrom,
            time: getCurrentDate(' '),
        };
        toast.success('The emergency call has been dispached!!');
        let historyCalls;

        if (typeof window !== 'undefined') {
            historyCalls = localStorage.getItem('doneEm');
            historyCalls = JSON.parse(historyCalls);
            if (historyCalls) {
                historyCalls = [...historyCalls, doneCall];
            } else {
                historyCalls = [doneCall];
            }
        }
        localStorage.setItem('doneEm', JSON.stringify(historyCalls));

        setOpen(false);
        setTrucksFrom([]);
        setSelectedCall(null);
    };
    const calculateStock = async (call) => {
        const latLocatieEm = call.latitude;
        const lonLocatieEm = call.longitude;
        let FireTrucksNeed = call.requests[0].Quantity;
        let MedicalTrucksNeed = call.requests[1].Quantity;
        let PoliceTrucksNeed = call.requests[2].Quantity;
        let getAllTrucksLocation = await fetch(
            'http://localhost:5000/fire/search'
        );
        let location_distances = [];
        getAllTrucksLocation = await getAllTrucksLocation.json();
        getAllTrucksLocation.forEach((location) => {
            const dist = getDistanceFromLatLonInKm(
                latLocatieEm,
                lonLocatieEm,
                location.latitude,
                location.longitude
            );

            location_distances = [
                ...location_distances,
                {
                    distanta_min_em: dist,
                    city: location.city,
                    county: location.county,
                },
            ];
        });
        location_distances.sort((a, b) => {
            return a.distanta_min_em - b.distanta_min_em;
        });
        let ok = 1;
        while (ok) {
            let i = 0;
            if (FireTrucksNeed || MedicalTrucksNeed || PoliceTrucksNeed) {
                for (
                    i = 0;
                    i < location_distances.length &&
                    (FireTrucksNeed != 0 ||
                        MedicalTrucksNeed != 0 ||
                        PoliceTrucksNeed != 0);
                    i++
                ) {
                    let nearFireTruck;
                    if (FireTrucksNeed != 0) {
                        try {
                            nearFireTruck = await fetch(
                                `http://localhost:5000/fire/searchbycity?county=${location_distances[i].county}&city=${location_distances[i].city}`
                            );
                            if (nearFireTruck.ok) {
                                nearFireTruck = await nearFireTruck.json();
                            } else {
                                console.log(
                                    `Error status code ${nearFireTruck.status}`
                                );
                            }
                        } catch (error) {
                            console.log('Error');
                        }
                    }
                    let nearAmbulance;
                    if (MedicalTrucksNeed != 0) {
                        try {
                            nearAmbulance = await fetch(
                                `http://localhost:5000/medical/searchbycity?county=${location_distances[i].county}&city=${location_distances[i].city}`
                            );
                            console.log(nearAmbulance);
                            if (nearAmbulance.ok) {
                                nearAmbulance = await nearAmbulance.json();
                            } else {
                                console.log(
                                    `Error status code ${nearAmbulance.status}`
                                );
                            }
                        } catch (error) {
                            console.log('Error');
                        }
                    }
                    let nearPolice;
                    if (PoliceTrucksNeed != 0) {
                        try {
                            nearPolice = await fetch(
                                `http://localhost:5000/police/searchbycity?county=${location_distances[i].county}&city=${location_distances[i].city}`
                            );
                            console.log(nearPolice);
                            if (nearPolice.ok) {
                                nearPolice = await nearPolice.json();
                            } else {
                                console.log(
                                    `Error status code ${nearPolice.status}`
                                );
                            }
                        } catch (error) {
                            console.log('Error');
                        }
                    }

                    if (Math.sign(nearPolice) === 1 && PoliceTrucksNeed != 0) {
                        console.log(nearPolice, PoliceTrucksNeed);
                        if (nearPolice < PoliceTrucksNeed && nearPolice != 0) {
                            set_trucks_from.push({
                                type: 'Police',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: nearPolice,
                                distance: location_distances[i].distanta_min_em,
                            });
                            PoliceTrucksNeed = PoliceTrucksNeed - nearPolice;
                        } else if (nearPolice === PoliceTrucksNeed) {
                            set_trucks_from.push({
                                type: 'Police',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: PoliceTrucksNeed,
                                distance: location_distances[i].distanta_min_em,
                            });
                            PoliceTrucksNeed = 0;
                        } else if (nearPolice > PoliceTrucksNeed) {
                            set_trucks_from.push({
                                type: 'Police',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: PoliceTrucksNeed,
                                distance: location_distances[i].distanta_min_em,
                            });
                            PoliceTrucksNeed = 0;
                        }
                    }
                    if (nearAmbulance && MedicalTrucksNeed != 0) {
                        if (
                            nearAmbulance < MedicalTrucksNeed &&
                            nearAmbulance != 0
                        ) {
                            set_trucks_from.push({
                                type: 'Ambulance',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: nearAmbulance,
                                distance: location_distances[i].distanta_min_em,
                            });
                            MedicalTrucksNeed =
                                MedicalTrucksNeed - nearAmbulance;
                        } else if (nearAmbulance === MedicalTrucksNeed) {
                            set_trucks_from.push({
                                type: 'Ambulance',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: MedicalTrucksNeed,
                                distance: location_distances[i].distanta_min_em,
                            });
                            MedicalTrucksNeed = 0;
                        } else if (nearAmbulance > MedicalTrucksNeed) {
                            set_trucks_from.push({
                                type: 'Ambulance',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: MedicalTrucksNeed,
                                distance: location_distances[i].distanta_min_em,
                            });
                            MedicalTrucksNeed = 0;
                        }
                    }

                    if (nearFireTruck && FireTrucksNeed != 0) {
                        if (
                            nearFireTruck < FireTrucksNeed &&
                            nearFireTruck != 0
                        ) {
                            set_trucks_from.push({
                                type: 'Fire',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: nearFireTruck,
                                distance: location_distances[i].distanta_min_em,
                            });
                            FireTrucksNeed = FireTrucksNeed - nearFireTruck;
                        } else if (nearFireTruck === FireTrucksNeed) {
                            set_trucks_from.push({
                                type: 'Fire',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: FireTrucksNeed,
                                distance: location_distances[i].distanta_min_em,
                            });
                            FireTrucksNeed = 0;
                        } else if (nearFireTruck > FireTrucksNeed) {
                            set_trucks_from.push({
                                type: 'Fire',
                                county: location_distances[i].county,
                                city: location_distances[i].city,
                                trucks: FireTrucksNeed,
                                distance: location_distances[i].distanta_min_em,
                            });
                            FireTrucksNeed = 0;
                        }
                    }
                }
            }
            setTrucksFrom(set_trucks_from);

            ok = 0;
        }
    };
    return (
        <div style={{ paddingTop: '10px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <Button
                    variant="contained"
                    style={{ background: '#22577A' }}
                    onClick={verificaCalls}
                >
                    Check calls
                </Button>
                <Link
                    href={{
                        pathname: '/history',
                    }}
                >
                    <Button
                        variant="contained"
                        style={{ background: '#38A3A5', marginLeft: '20px' }}
                    >
                        History calls
                    </Button>
                </Link>
            </div>
            <TableContainer component={Paper} style={{ borderRadius: '30px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow
                            style={{
                                background: '#C7F9CC',
                            }}
                        >
                            <TableCell align="right">Priority</TableCell>
                            <TableCell align="right">City</TableCell>
                            <TableCell align="right">County</TableCell>
                            <TableCell align="right">Latitude</TableCell>
                            <TableCell align="right">Longitude</TableCell>
                            <TableCell align="right">
                                Needed Fire Trucks
                            </TableCell>
                            <TableCell align="right">
                                Needed Ambulance
                            </TableCell>
                            <TableCell align="right">Needed Police</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {calls &&
                            calls.map((call) => (
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
                                        {calculatePriority(call.requests) >=
                                        6 ? (
                                            <Tooltip title="High">
                                                <CircleIcon
                                                    style={{ color: '#ef476f' }}
                                                />
                                            </Tooltip>
                                        ) : calculatePriority(call.requests) <=
                                              5 &&
                                          calculatePriority(call.requests) >
                                              2 ? (
                                            <Tooltip title="Medium">
                                                <CircleIcon
                                                    style={{ color: '#ffd166' }}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Low">
                                                <CircleIcon
                                                    style={{ color: '#06d6a0' }}
                                                />
                                            </Tooltip>
                                        )}
                                    </TableCell>
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
                                    {call.requests &&
                                        call.requests.map((type) => (
                                            <TableCell
                                                align="right"
                                                key={Math.floor(
                                                    (1 + Math.random()) *
                                                        0x10000
                                                )
                                                    .toString(16)
                                                    .substring(1)}
                                            >
                                                {type.Quantity}
                                            </TableCell>
                                        ))}
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            style={{ background: '#57CC99' }}
                                            onClick={() => {
                                                handleClickOpen();
                                                setSelectedCall(call);
                                                calculateStock(call);
                                            }}
                                        >
                                            Accept
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* {!calls && (
                <h2 style={{ textAlign: 'center' }}>
                    No calls for the moment, please check for calls.
                </h2>
            )} */}
            {selectedCall && (
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
                        {'Send emergency cars'}
                    </DialogTitle>
                    <DialogContent>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                columnGap: '50px',
                                justifyContent: 'center',
                            }}
                        >
                            <div>
                                <h3>Where?</h3>
                                <div>City: {selectedCall.city}</div>
                                <div>County: {selectedCall.county}</div>
                                <div>
                                    Location:{' '}
                                    <a
                                        href={`https://maps.google.com/?q=${selectedCall.latitude},${selectedCall.longitude}`}
                                        target="blank"
                                        style={{
                                            color: '#38A3A5',
                                            fontWeight: '600',
                                        }}
                                    >
                                        Click here
                                    </a>
                                </div>
                            </div>
                            <div>
                                <h3>Needed units</h3>
                                {selectedCall.requests.map((type) => (
                                    <div
                                        style={{ display: 'flex', gap: '10px' }}
                                        key={Math.floor(
                                            (1 + Math.random()) * 0x10000
                                        )
                                            .toString(16)
                                            .substring(1)}
                                    >
                                        {type.type === 'Fire' ? (
                                            <FireTruckOutlinedIcon
                                                style={{ color: '#38A3A5' }}
                                            />
                                        ) : type.type === 'Medical' ? (
                                            <MedicalServicesOutlinedIcon
                                                style={{ color: '#38A3A5' }}
                                            />
                                        ) : (
                                            <LocalPoliceOutlinedIcon
                                                style={{ color: '#38A3A5' }}
                                            />
                                        )}{' '}
                                        {type.type}: {type.Quantity}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <hr
                            style={{ background: '#38A3A5', height: '3px' }}
                        ></hr>
                        <div>
                            <h3 style={{ textAlign: 'center' }}>
                                Nearest units available
                            </h3>
                        </div>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 100 }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">
                                            Units Type
                                        </TableCell>
                                        <TableCell align="right">
                                            County
                                        </TableCell>
                                        <TableCell align="right">
                                            City
                                        </TableCell>
                                        <TableCell align="right">
                                            Available Units
                                        </TableCell>
                                        <Tooltip title="The avarage time to arrived at destination">
                                            <TableCell align="right">
                                                Avg time
                                            </TableCell>
                                        </Tooltip>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {trucksFrom.length ? (
                                        trucksFrom.map((obj) => (
                                            <TableRow
                                                key={Math.floor(
                                                    (1 + Math.random()) *
                                                        0x10000
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
                                                <TableCell align="right">
                                                    {time_convert(
                                                        parseInt(
                                                            (obj.distance /
                                                                90) *
                                                                60
                                                        )
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
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
                                                <Skeleton animation="wave" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Skeleton animation="wave" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Skeleton animation="wave" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Skeleton animation="wave" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Skeleton animation="wave" />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            style={{ color: '#f94c4c' }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        {trucksFrom.length ? (
                            <Button
                                style={{ color: '#38A3A5' }}
                                onClick={handleSubmit}
                                autoFocus
                            >
                                Dispatch
                            </Button>
                        ) : (
                            <CircularProgress
                                style={{ color: '#38A3A5' }}
                                size="22px"
                            />
                        )}
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}
