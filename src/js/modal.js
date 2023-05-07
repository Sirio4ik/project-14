const openButton = document.querySelectorAll('[data-popup]');
const closeButton = document.querySelectorAll('[data-popup-close]');
const allPopups = document.querySelectorAll('.modal');
const modalBackdrop = document.querySelector('.backdrop');
const fixedElements = [].filter.call(document.all, e => getComputedStyle(e).position == 'fixed');
const body = document.querySelector('.body');
const bodyPadding = window.innerWidth - document.querySelector('.main').offsetWidth;

const forms = document.querySelectorAll('.form');
const inputs = document.querySelectorAll('input, textarea');

const addErrorText = true;
const minSymbols = 3;
const errorSymbols = 'Minimum characters!';
const errorEmptyInput = 'The field must not be empty!';
const errorNameInput = 'Only letters are allowed!';
const errorEmailInput = 'Wrong E-mail format!';
const errorPhoneInput = 'Wrong phone format!';
const errorMinNumber = 'The minimum value is';
const errorMaxNumber = 'The maximum value is';

//MODAL OPEN BUTTON CLICK
openButton.forEach(btn => {
   btn.addEventListener('click', function (event) {
      event.preventDefault();
      popup(this.dataset.popup);
   });
});

//MODAL CLOSE BUTTON CLICK
closeButton.forEach(closeBtn => {
   closeBtn.addEventListener('click', modalClose);
});

//POPUP OPEN FUNCTION
function popup(id) {
   popupClose();
   if (modalBackdrop.classList.contains('is-hidden')) {
      modalBackdrop.classList.remove('is-hidden');
      scrollbarModify();
   }
   document.getElementById(id).classList.remove('is-hidden');
}

//POPUP CLOSE FUNCTION
function popupClose() {
   allPopups.forEach(popup => {
      popup.classList.add('is-hidden');
      setTimeout(function () {
         popup.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 300);
   });
}

//MODAL CLOSE FUNCTION
function modalClose() {
   popupClose();
   modalBackdrop.classList.add('is-hidden');
   setTimeout(function () {
      scrollbarModify();
      formsReset();
   }, 300);
}

//SCROLL BAR MODIFY
function scrollbarModify() {
   body.classList.toggle('lock');
   fixedElements.forEach(fixedElement => {
      if (body.classList.contains('lock')) {
         body.style.paddingRight = bodyPadding + 'px';
         fixedElement.style.paddingRight = bodyPadding + 'px';
      } else {
         body.style.paddingRight = '0px';
         fixedElement.style.paddingRight = '0px';
      }
   });
}

// ----------------------------------------- FORM SEND AND VALIDATION

//CLEAN INPUT ON FOCUS
inputs.forEach(input => {
   input.addEventListener('focus', function () {
      this.classList.remove('red');
      if (addErrorText == true) {
         let nextSibling = this.nextSibling;
         while (nextSibling && nextSibling.nodeType != 1) {
            nextSibling = nextSibling.nextSibling;
         }
         let nextElementClass = nextSibling.classList[0];
         if (nextElementClass === 'label__error') {
            nextSibling.classList.remove('active');
            setTimeout(function () {
               nextSibling.remove();
            }, 250);
         }
      }
   });
});

//FORMS SUBMIT
forms.forEach(form => {
   form.addEventListener('submit', async function (event) {
      event.preventDefault();
      let answer = checkForm(this);
      if (answer != false) {
         popup('loading');
         const formData = new FormData(this);
         let dataArray = {};
         formData.forEach((value, key) => (dataArray[key] = value));
         let jsonData = JSON.stringify(dataArray);
         setTimeout(function () {
            popup('ok');
            formsReset();
            console.log(jsonData);
         }, 1000);
      }
      return false;
   });
});

//FORMS VALIDATION
function checkForm(formId) {
   let checker = true;
   formId.querySelectorAll('[required]').forEach(required => {
      if (required.value.length === 0) {
         addError(required, errorEmptyInput);
      } else {
         if (required.value.length < minSymbols && required.type !== 'number') {
            let minSymbolsErrorText = errorSymbols.split(' ');
            addError(required, minSymbolsErrorText[0] + ' ' + minSymbols + ' ' + minSymbolsErrorText[1]);
         } else {
            //type Name
            if (required.name == 'name' && /[^A-zА-яЁё\+ ()\-]/.test(required.value)) {
               addError(required, errorNameInput);
            }
            //type email
            if (required.type == 'email' && !/^[\.A-z0-9_\-\+]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z]{1,4}$/.test(required.value)) {
               addError(required, errorEmailInput);
            }
         }
      }

      //ERROR TEXT CREATE
      function addError(correntLabel, text) {
         if (!correntLabel.classList.contains('red')) {
            if (addErrorText === true) {
               let nextElementClass = correntLabel.nextSibling.nextSibling.classList[0];
               if (nextElementClass !== 'label__error') {
                  correntLabel.insertAdjacentHTML('afterEnd', '<div class="label__error">' + text + '</div>');
                  setTimeout(function () {
                     correntLabel.nextSibling.classList.add('active');
                  }, 5);
               }
            }
         }
         required.classList.add('red');
         checker = false;
      }
   });
   return checker;
}

//OLL FORMS RESET
function formsReset() {
   forms.forEach(form => {
      form.reset();
      form.querySelectorAll('.label__error').forEach(errors => {
         errors.classList.remove('active');
         setTimeout(function () {
            errors.remove();
         }, 250);
      });
      form.querySelectorAll('[required]').forEach(required => {
         required.classList.remove('red');
      });
   });
}
