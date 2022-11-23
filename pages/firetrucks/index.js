import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function FireTrucks()  {
    const [res, setRes] = useState();
    const [city, setCity] = useState();
    useEffect(() => {
        fetch('http://localhost:5000/locations').then((response) => {
            response.json().then((resJson) => {
                resJson.forEach(element => {
                    delete Object.assign(element, {label: element.name})['name'];
                })
                console.log(resJson)
                setCity(resJson);
            })
           });
    }, []);
    return (
        <div>
            {city 
            && 
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={city}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Oras" />}
            />}  
        </div>
    )
}