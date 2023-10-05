export function EmailValidation(email) {
  let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return emailReg.test(email.trim());
}
export function PhoneNumberValidation(phone) {
  //VietNam phone number
  let regPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

  return regPhoneNumber.test(phone.trim());
}
export function PasswordValidation(password) {
  //VietNam phone number
  let regPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  return regPassword.test(password.trim());
}
export function NameValidation(name) {
  return name.trim().length > 0;
}
