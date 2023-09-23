// Variables
const lg = 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1))';
const bright = 'brightness(0.9)';
const bodyChildren = document.body.children;
const backProjectBtn = document.querySelector('#back-project');
const modal = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('#modal-close');
const allModalCards = document.querySelectorAll('.modal-card');
const writePledge = document.querySelectorAll('.pledge-area');
const submitButton = document.querySelectorAll('.submit-button');
const allRadios = document.querySelectorAll('input[name="card-radio"]');
const blockedRadio = document.querySelector('input[name="modal-card-block"]');
const rewardBtn = document.querySelectorAll('.reward-btn');
const successBox = document.querySelector('.success');
const closeSuccessBox = document.querySelector('#success-close');
const counter = document.querySelectorAll('.count');
const mediaBarImg = document.querySelector('.media-bar').children[0];
const mediaNav = document.querySelector('.media-nav');
const bookmarkButton = document.querySelector('.bookmark');
const moneyAmountInput = document.querySelector('#money-amount');
const moneyAmountSpan = document.querySelector('.money.btn-money.btn span');
let mediaSelected = false;
let handlers = [];
let totalBackers = 5007; 
let currentProgress = 89914; 
const goalAmount = 100000; 


// Event Listeners
mediaBarImg.addEventListener('click', mediaBarToggle);
backProjectBtn.addEventListener('click', openModal);
modalCloseBtn.addEventListener('click', closeModal);

blockedRadio.addEventListener('click', () => {
    if (blockedRadio.checked) blockedRadio.checked = false;
});

bookmarkButton.addEventListener('click', () => {
    // Toggle the bookmarked state
    const bookmarkIcon = bookmarkButton.querySelector('img');
    const bookmarkText = bookmarkButton.querySelector('li');

    if (bookmarkIcon.classList.contains('bookmarked')) {
        bookmarkIcon.classList.remove('bookmarked');
        bookmarkText.textContent = 'Bookmark';
    } else {
        bookmarkIcon.classList.add('bookmarked');
        bookmarkText.textContent = 'Bookmarked';
    }
});

moneyAmountInput.addEventListener('input', (event) => {
    const newAmount = event.target.value;
    moneyAmountSpan.textContent = newAmount;
});

submitButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        console.log('clicked');
        toggleSuccessMsg(false);
        const pledgeAmount = parseInt(moneyAmountSpan.textContent);

        if (index === 0) return;
        let card = allModalCards[index];
        let cnt = counter[index - 1].innerHTML;
        cnt--;
        console.log(cnt);
        card.children[2].children[0].innerHTML = cnt;
        card.children[0].children[1].children[0].children[2].children[0].innerHTML = cnt;
        counter[index - 1].innerHTML = cnt;

        // Update total money raised
        const totalMoneyRaised = document.querySelector('#total-money-raised');
        const currentMoneyRaised = parseInt(totalMoneyRaised.textContent.replace(/\D/g, ''));
        const newMoneyRaised = currentMoneyRaised + pledgeAmount;
        totalMoneyRaised.textContent = `$${newMoneyRaised.toLocaleString()}`;

        // Update current progress
        currentProgress += pledgeAmount;
        updateProgressBar();

        // Update total backers
        updateBackersCount();

        // Show success message
        successBox.style.display = 'flex';

        // Close the modal
        modal.style.display = 'none';
    });
});

closeSuccessBox.addEventListener('click', toggleSuccessMsg.bind(true));

// Functions
function mediaBarToggle() {
    if (mediaSelected) {
        mediaSelected = false;
        mediaNav.style.display = 'none';
        mediaBarImg.setAttribute('src', 'images/icon-hamburger.svg');
    } else {
        mediaSelected = true;
        mediaNav.style.display = 'flex';
        mediaBarImg.setAttribute('src', 'images/icon-close-menu.svg');
    }
}

function openModal() {
    mediaSelected = false;
    mediaNav.style.display = 'none';
    mediaBarImg.setAttribute('src', 'images/icon-hamburger.svg');
    mediaBarImg.removeEventListener('click', mediaBarToggle);

    [...bodyChildren].forEach(element => {
        if (!element.classList.contains('modal')) element.style.filter = bright;
    });
    document.body.style.backgroundImage = lg;

    modal.style.display = 'initial';

    for (let i = 0; i < rewardBtn.length; i++) {
        rewardBtn[i].removeEventListener('click', handlers[i]);
    }
    handlers = [];
}

function closeModal() {
    mediaBarImg.addEventListener('click', mediaBarToggle);

    [...bodyChildren].forEach(element => (element.style.filter = 'initial'));
    document.body.style.backgroundImage = 'initial';

    modal.style.display = 'none';
    writePledge.forEach(pledge => (pledge.children[0].value = ''));
    allRadios.forEach(radio => (radio.checked = false));
    checkForCheckedRadios();
    rewardBtnCheck();
}

allRadios.forEach((radio, index) => {
    radio.addEventListener('click', () => {
        radio.checked = true;
        checkForCheckedRadios();
    });
});

function checkForCheckedRadios() {
    allRadios.forEach((radio, index) => {
        if (radio.checked) {
            pledgeArea(index, true);
        } else {
            pledgeArea(index, false);
        }
    });
}

function pledgeArea(index, open) {
    let ancestor = allRadios[index];
    while (!ancestor.classList.contains('modal-card')) ancestor = ancestor.parentElement;

    [...ancestor.children].forEach((child, index) => {
        if (child.classList.contains('modal-card-bottom')) {
            if (open) child.style.display = 'flex';
            else child.style.display = 'none';
        }
    });
}

function rewardBtnCheck() {
    for (let i = 0; i < rewardBtn.length; i++) {
        if (rewardBtn[i].innerHTML === 'Out of Stock') continue;
        let wrapper = rewardBtnRadioCheck.bind(this, i);
        handlers.push(wrapper);
        rewardBtn[i].addEventListener('click', wrapper);
    }
}

function rewardBtnRadioCheck(i) {
    openModal();
    allRadios[i + 1].checked = true;
    let yOffset = -100;
    let y = allModalCards[i + 1].getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    checkForCheckedRadios();
}

function toggleSuccessMsg(successMsgAppears) {
    if (successMsgAppears) {
        closeModal();
        successBox.style.display = 'none';
    } else {
        closeModal();
        mediaBarImg.removeEventListener('click', mediaBarToggle);
        successBox.style.display = 'flex';
        document.body.style.backgroundImage = lg;
        let yOffset = -150;
        let y = successBox.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        for (let i = 0; i < rewardBtn.length; i++) {
            rewardBtn[i].removeEventListener('click', handlers[i]);
        }
        handlers = [];
    }
}

// Function to update the total backers count
function updateBackersCount() {
    totalBackers++;
    const totalBackersText = document.getElementById('total-backers');
    totalBackersText.textContent = totalBackers.toLocaleString();
}

// Function to update the progress bar
function updateProgressBar() {
    // Calculate the progress percentage based on your goal and current progress
    const progressPercentage = (currentProgress / goalAmount) * 100;

    // Update the width of the progress bar
    progressBar.style.width = progressPercentage + "%";
}

// Initialization
rewardBtnCheck(); // Initialize reward button functionality
updateProgressBar(); 