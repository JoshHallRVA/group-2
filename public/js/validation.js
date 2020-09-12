
const form = document.getElementById('cms');
const names = document.getElementById('reserve-name');
const email = document.getElementById('reserve-email');
const style = document.getElementById('reserve-style');
const brand = document.getElementById('reserve-brand');
const shoeSize = document.getElementById('reserve-shoeSize');
const price = document.getElementById('reserve-price');
const img = document.getElementById('file-input');
 
form.addEventListener('submit', (e) => {
   e.preventDefault();
 
   checkInputs();
});
 
function checkInputs() {
   const nameVal = names.value.trim();
   const emailVal = email.value.trim();
   const styleVal = style.value.trim();
   const brandVal = brand.value.trim();
   const shoeSizeVal = shoeSize.value.trim();
   const priceVal = price.value.trim();



 
   if (emailVal === '') {
       //show error
       //add error class
       setErrorFor(email, 'email cannot be blank');
 
   }  else if(!isEmail(emailVal)) {
       setErrorFor(email, 'email is not valid');
   }
   else {
       //add success
       setSuccessFor(email);
   }

   if (nameVal === ''){
      setErrorFor(names, 'name cannot be blank');
   } else {
      setSuccessFor(names);
   }

   if (styleVal === ''){
      setErrorFor(style, 'style cannot be blank');
   } else {
      setSuccessFor(style);
   }

   if (brandVal === ''){
      setErrorFor(brand, 'brand cannot be blank');
   } else {
      setSuccessFor(brand);
   }

   if (shoeSizeVal === ''){
      setErrorFor(shoeSize, 'shoe size cannot be blank');
   } else {
      setSuccessFor(shoeSize);
   }

   if (priceVal === ''){
      setErrorFor(price, 'price cannot be blank');
   } else {
      setSuccessFor(price);
   }
}
 
function setErrorFor(input, message) {
   const iconControl = input.parentElement;
   const small = iconControl.querySelector('small');
 
   small.innerText = message;
 
   iconControl.className = 'icon-control error';
}
 
function setSuccessFor(input, message) {
   const iconControl = input.parentElement;
   iconControl.className = 'icon-control success';
}
 
function isEmail(email) {
   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
}
