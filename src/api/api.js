const makeRequest = async (url, method, data) =>  {
    console.log(url, method, data);
    const token = localStorage.getItem('token');
    const body = {
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        method,
    };
    return fetch(url, body)
        .then(res => res.json())
        .then(data => {if(data.error) console.error(data.error); return data;});



    // return await (await fetch(url, body)).json();
};

const getData = async url => await makeRequest(url, 'GET');
const postData = async (url, data) => await makeRequest(url, 'POST', data);
const putData = async (url, data) => await makeRequest(url, 'PUT', data);
const deleteData = async url => await makeRequest(url, 'DELETE');

export {getData, postData, putData, deleteData};