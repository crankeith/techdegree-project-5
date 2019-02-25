fetchUser()
    .then(data => {
        console.log(data.results[0]);
    });

function fetchUser(){
    return fetch('https://randomuser.me/api/')
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log("There was an error retrieving a user: ", error))
}

function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}