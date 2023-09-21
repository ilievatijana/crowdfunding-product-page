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
let mediaSelected = false;
let handlers = [];

// Event Listeners
mediaBarImg.addEventListener('click', mediaBarToggle);
backProjectBtn.addEventListener('click', openModal);
modalCloseBtn.addEventListener('click', closeModal);
blockedRadio.addEventListener('click', () => {
    if (blockedRadio.checked) blockedRadio.checked = false;
});

submitButton.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        toggleSuccessMsg(false);
        if (index === 0) return;
        let card = allModalCards[index];
        let cnt = counter[index - 1].innerHTML;
        cnt--;
        card.children[2].children[0].innerHTML = cnt;
        card.children[0].children[1].children[0].children[2].children[0].innerHTML = cnt;
        counter[index - 1].innerHTML = cnt;
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
        [...bodyChildren].forEach(element => (element.style.filter = 'initial'));
        document.body.style.backgroundImage = 'initial';
    } else {
        closeModal();
        mediaBarImg.removeEventListener('click', mediaBarToggle);
        successBox.style.display = 'flex';
        [...bodyChildren].forEach(element => {
            if (element.classList.contains('success')) element.style.filter = 'initial';
            else element.style.filter = bright;
        });
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

// Initialization
rewardBtnCheck(); // Initialize reward button functionality



