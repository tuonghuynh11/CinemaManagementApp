import CryptoJS from "crypto-js";
const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const Base64 = {
  btoa: (input = "") => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input = "") => {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

////////Send email API
const createMailOTPForm = (otpCode) => {
  const html = `<div style='font-family:Helvetica,Arial,sans-serif; min-width:500px; overflow:auto; line-height:2'>
  <div style='margin:50px auto; width:70%; padding:20px 0 '>
      <div style='border-bottom:1px solid #eee;text-align: center'>
      <img src="https://seeklogo.com/images/C/cinema-logo-53411DFFE5-seeklogo.com.png" alt="Logo" style="vertical-align: middle;width:200px;height:200px">
      <a style='display:block;font-size: 1.4em; color: #303f9f; text-decoration: none; font-weight: 600;margin-top: 10px;margin-bottom: 10px '>
    
      Master Cinema
    </a>

      </div>
      <p style='font-size:1.1em'>Hello You,</p>
      <p>The system has received a request to reset your password. Please enter the OTP code below to continue. Note, the OTP code is only valid for 5 minutes. If this is not your request, please disregard this email.</p>
      <h2 style='background:#303f9f; margin:0 auto; width:max-content; padding:0 10px; color:#fff; border-radius:4px; '>${otpCode}</h2>
      <p style='font-size:0.9em;'>Best regard.<br />Master Cinema</p>
      <hr style='border:none; border-top:1px solid #eee' />
      <div style='float:right; padding:8px 0; color:#aaa; font-size:0.8em; line-height:1; font-weight:300'>
          <p align='right'>Master Cinema - KTPM2021</p>
          <p>University of Information Technology - ĐHQG TP.HCM</p>
      </div>
  </div>
</div>`;
  return html;
};
export async function sendEmail(email, content) {
  const MJ_APIKEY_PUBLIC = "97ef95802cb73fd61a383fc8a41491f0";
  const MJ_APIKEY_PRIVATE = "1e860af0fcbefa2ddc4f51d028b1ecff";
  let mailContent = {
    FromEmail: "manhphuoc58@gmail.com",
    FromName: "Cinema Master",
    Subject: "OTP code for reset password",
    "Text-part": `OTP code: ${content}`,
    Recipients: [
      {
        Email: email,
      },
    ],
  };
  mailContent["Html-part"] = createMailOTPForm(content);
  // body: JSON.stringify({
  //   FromEmail: "manhphuoc58@gmail.com",
  //   FromName: "Cinema Master",
  //   Subject: "OTP code for reset password",
  //   "Text-part": `OTP code: ${content}`,
  //   Recipients: [
  //     {
  //       Email: email,
  //     },
  //   ],
  // }),
  const response = await fetch("https://api.mailjet.com/v3/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Base64.btoa(MJ_APIKEY_PUBLIC + ":" + MJ_APIKEY_PRIVATE),
    },
    // body: '{\n\t\t"FromEmail":"pilot@mailjet.com",\n\t\t"FromName":"Mailjet Pilot",\n\t\t"Subject":"Your email flight plan!",\n\t\t"Text-part":"Dear passenger, welcome to Mailjet! May the delivery force be with you!",\n\t\t"Html-part":"<h3>Dear passenger, welcome to <a href=\\"https://www.mailjet.com/\\">Mailjet</a>!<br />May the delivery force be with you!",\n\t\t"Recipients":[{"Email":"passenger@mailjet.com"}]\n\t}',
    body: JSON.stringify(mailContent),
  }).then((response) => response);
  return response;
}

///database

//hash password to MD5, base64
function hashPasswordAndEncodeBase64(password) {
  // Hash the password using MD5
  const hashedPassword = CryptoJS.MD5(password).toString();

  // Encode the hashed password in Base64
  const base64EncodedPassword = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(hashedPassword)
  );

  return base64EncodedPassword;
}

export function addUserToDatabase({
  email = "",
  phoneNumber = "",
  password,
  fullName,
}) {
  // addUser(email, phoneNumber, hashPasswordAndEncodeBase64(password), fullName);
  console.log("add to database", email, phoneNumber, password, fullName);
  console.log(hashPasswordAndEncodeBase64(password));
}

export function updateUserPassword({ idUser = "", newPassword }) {
  // updatePassword(idUser,hashPasswordAndEncodeBase64(password));

  console.log("update user password", newPassword);
}

////Payment API
