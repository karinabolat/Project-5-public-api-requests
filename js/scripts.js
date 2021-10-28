const gallery = document.getElementById('gallery');
const modalContainer = document.createElement('div');
modalContainer.className = 'modal-container';
gallery.after(modalContainer);
const html = `
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container"></div>
    </div>`
modalContainer.innerHTML = html;
modalContainer.style.display = 'none'

/**
 * Fetches data on 12 employees and stores the information to a variable
 */

const employees = fetch('https://randomuser.me/api/?results=12&inc=name,location,email,dob,cell,picture&nat=gb,us&noinfo')
    .then(response => response.json())
    .then(data => data.results)
    .catch(error => console.log('There is a problem:', error))

/**
 * Generates and displays information cards for all employees
 */
employees.then(persons => persons.map(person => generateCard(person)))

/**
 * Creates necessary elements and attributes of a gallery card
 * @param {object} person - information with all employee details
 */

function generateCard(person) {
    const card = document.createElement('div');
    card.className = 'card';
    const html = `
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
    `;
    card.innerHTML = html;
    gallery.appendChild(card);
}

/**
 * Creates a modal with detailed employee information
 * @param {object} person - object containing employee details
 */

function getModal(person) {
    const modalInfo = modalContainer.querySelector('.modal-info-container');
    const html = `
        <img class="modal-img" src="${person.picture.large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
        <p class="modal-text">${person.email}</p>
        <p class="modal-text cap">${person.location.city}</p>
        <hr>
        <p class="modal-text">${formatTel(person.cell)}</p>
        <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
        <p class="modal-text">Birthday: ${formatDOB(person.dob.date)}</p>
    `;
    modalInfo.innerHTML = html;
}

/**
 * Formats date of birth (DOB) to 'MM/DD/YYYY'.
 * @param {string} stringDOB employee DOB
 * @returns employee DOB in the format of 'MM/DD/YYYY'
 */
function formatDOB(stringDOB) {
    const dob = new Date(stringDOB);
    const month = ("0" + (dob.getMonth() + 1)).slice(-2);
    const day = ("0" + dob.getDate()).slice(-2);
    const newDOB = month +"/"+ day + `/${dob.getFullYear()}`;
    return newDOB;
}

/**
 * Formats telephone numbers to '(XXX) XXX-XXXX'. All not 10-digit telephone numbers are modified as close to this format as posible, no changes to initial value.
 * @param {string} number - employee's telephone number
 * @returns formatted telephone number
 */
function formatTel(number) {
    const justNumbers = number.replace(/\D/g, "");
    const regex = /(\d{3})(\d{3})(\d{2,5})/;
    return justNumbers.replace(regex, '($1) $2-$3');
}

/**
 * Displays a modal
 * @param {string} name - employee to display
 */
function displayModal(name) {
    employees
            .then(persons => persons.filter(person => `${person.name.first} ${person.name.last}`=== name))
            .then(person => getModal(person[0]));
}

/**
 * Listens for clicks to display modal
 */
gallery.addEventListener('click', e => {
      
    if (e.target.className == 'card') {
        modalContainer.style.display = 'block';
        const h3 = e.target.querySelector('h3').textContent;
        displayModal(h3);

    } else if (e.target.className != 'gallery') {
        modalContainer.style.display = 'block';
        var parent = e.target.parentNode;
        while (parent.className != 'card') {
            parent = parent.parentNode;
        }
        const h3 = parent.querySelector('h3').textContent;
        displayModal(h3);
    }
});

/**
 * Closes modal upon a click
 */
const button = document.getElementById('modal-close-btn');
button.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});