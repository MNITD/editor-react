const makeRequest = async (url, method, data) =>  {
    const body = {
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        method,
    };
    return await (await fetch(url, body)).json();
};

const getData = async url => await makeRequest(url, 'GET');
const postData = async (url, data) => await makeRequest(url, 'POST', data);
const putData = async (url, data) => await makeRequest(url, 'PUT', data);
const deleteData = async url => await makeRequest(url, 'DELETE');

export {getData, postData, putData, deleteData};