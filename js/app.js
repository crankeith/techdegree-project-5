let userData;
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

//Get and store user data and display on page
fetchUser(12)
    .then(data => {
        //Store user data and display user cards in gallery
        userData = data.results;
        displayUsers(userData);
    })
    .then(()=> {
        //Iterate over users and add event listeners to cards for modal
        userData.map((user, index) => {
            document.querySelector(`#${user.name.first}-${user.name.last}`)
                    .addEventListener('click', () => openModal( user, index ))
        });
    });

//Add search bar to the page
const search = `
    <form action="#" method="GET">
        <input type="search" name="q" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;
document.querySelector('.search-container').innerHTML = search;
document.addEventListener('submit', ( event ) => {
    event.preventDefault();
    const searchValue = event.target.q.value.toLowerCase();
    const filteredResults = userData.filter(user => {
        const fullname = user.name.first + ' ' + user.name.last;
        return fullname.indexOf(searchValue) >= 0;
    });
    displayUsers(filteredResults);
});

/**
 * Function to display a loading symbol and begin fetching the data from the API
 * @param {Number} qty - The number of users you want to fetch from the API
 * @returns {Promise} - Promise object returned from fetching data
 */
function fetchUser(qty){
    //Display loading gif and text while fetch is occurring
    gallery.innerHTML = `
        <div class="loading">
            <img src="./images/loading.gif" alt="loading" />
            <p>LOADING...</p>
        </div>
    `;
    //Fetch the data from the API
    return fetch(`https://randomuser.me/api/?results=${qty}&nat=us`)
        .then(checkStatus)
        .then((response) => {
            return response;
        })
        .then(res => res.json())
        .catch(error => console.log("There was an error retrieving a user: ", error))
}

/**
 * Helper function for checking status in fetch
 * @param {Response} response - Response object from Fetch
 * @returns {Promise} - Returns a resolved/rejected promise depending on results
 */
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * Function to add User cards to gallery based on user data
 * @param {Array} users - An array of objects containing each user
 */
function displayUsers(users){
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    //Function to create card based on single user
    const card = (user) => {
        return `<div id="${user.name.first}-${user.name.last}" class="card">
                    <div class="card-img-container">
                        <img class="card-img" src="${user.picture.thumbnail}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="card-text" title="${user.email}">${user.email.substring(0, 23) + '...'}</p>
                        <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                    </div>
                </div>`};
    //Iterate through user array to generate one HTML blob
    gallery.innerHTML = users.reduce((acc, curr) => {
        return acc + card(curr);
    }, '');
}

/**
 * Accepts a user object and turns into a block of HTML for inserting into modal
 * @param {Object} user - User data
 * @returns {string} - Block of HTML code for modal
 */
function createModalContent(user){
    return `
        <img class="modal-img" src="${user.picture.thumbnail}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="modal-text">${user.email}</p>
        <p class="modal-text cap">${user.location.city}</p>
        <hr>
        <p class="modal-text">${user.phone}</p>
        <p class="modal-text">${user.location.street}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
        <p class="modal-text">Birthday: ${user.dob.date}</p>
    `
}

/**
 * Adds modal to the DOM and loads selected user
 * @param { Object } user -  The selected user
 * @param { Number } index - The index position in the user data array
 */
function openModal(user, index){
    const modal = document.createElement('div');
    modal.classList.add('modal-container');
    //Simple function to generate modal
    const modalHTML = ( modalInfo ) => `
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    ${ modalInfo }
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" data-value="${index - 1}" class="modal-prev btn" ${index - 1 < 0 ? 'disabled' : ''}>Prev</button>
                <button type="button" id="modal-next" data-value="${index + 1}" class="modal-next btn" ${index + 1 >= userData.length ? 'disabled' : ''}>Next</button>
            </div>
    `;

    modal.innerHTML = modalHTML(createModalContent(user));
    body.appendChild(modal);
    document.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('.modal-btn-container').addEventListener('click', changeUserModal);
}

/**
 * Changes the user information in the modal
 * @param {Object} event - The event object
 */
function changeUserModal(event){
    const indexValue = Number(event.target.dataset.value);
    if( indexValue >= 0 && indexValue < userData.length ){
        document.querySelector('.modal-info-container').innerHTML = createModalContent(userData[indexValue]);

        const prev = document.querySelector('.modal-prev');
        prev.dataset.value = indexValue - 1;
        prev.disabled = indexValue - 1 < 0;

        const next = document.querySelector('.modal-next');
        next.dataset.value = indexValue + 1;
        next.disabled = indexValue + 1 >= userData.length

    }
}

/**
 * Removes the modal from the DOM
 */
function closeModal(){
    document.querySelector('.modal-container').remove();
}

