export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Example POST method implementation:
export async function postData(url = '', data = {}) {
    try {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        console.log(response);
        return response; // parses JSON response into native JavaScript objects
    } catch (error) {
        console.log('Method error');
    }
}

export function getCurrentDate(separator = '') {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let hour = newDate.getHours();
    let minutes = newDate.getMinutes();
    let secs = newDate.getSeconds();

    return `${year}/${
        month < 10 ? `0${month}` : `${month}`
    }/${date}${separator}${hour}:${minutes}:${secs}`;
}

export function calculatePriority(obiect) {
    let priority = 0;
    obiect.map((autospeciala) => {
        priority += autospeciala.Quantity;
    });
    return priority;
}
export function time_convert(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    if (minutes < 10) {
        return `${hours}:0${minutes}h`;
    }
    return `${hours}:${minutes}h`;
}
