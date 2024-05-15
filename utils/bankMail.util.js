const mailer = require("nodemailer");
const { EMAIL, PASS } = require("../config/env.config");

const sendBankMail = async (
  email,
  acknowledgementNumber,
  userImageUrl,
  evidenceImageUrls
) => {
  const transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });

  const evidenceImagesHtml = evidenceImageUrls
    .map(
      (url) =>
        `<img src="${url}" alt="Evidence Image" style="max-height: 20vh; margin-right: 10px; height: auto;" />`
    )
    .join("");

  const freezeLink = `https://cyber-secure.onrender.com/v1/bank/freeze?acknowledgementNumber=${acknowledgementNumber}`;
  const denyLink = `https://cyber-secure.onrender.com/v1/bank/deny?acknowledgementNumber=${acknowledgementNumber}`;

  const noticeHtml = `
    <center><h1 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: red;">Notice</h1></center>
    <p style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: larger;">We are writing to bring to your attention a matter of utmost urgency. A case with <span style="font-weight: 700; background-color: rgb(229, 255, 0);">Acknowledgement Number: ${acknowledgementNumber}</span> has been filed, and we request your prompt attention to freeze the associated bank account.</p>
    <div style="margin: 1rem; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: larger;">
      User Information: <br>
      <img src="${userImageUrl}" alt="">
    </div><br><br>
    <div style="margin: 1rem; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: larger;">
      Evidence: <br>
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        ${evidenceImagesHtml}
      </div>
    </div>
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: larger;">
      This request demands your immediate review within the next 24 hours. Failure to take appropriate action within this timeframe may result in severe consequences, including legal penalties.
    </div>
    <a href="${freezeLink}" style="text-decoration: none;"><button style="margin: 2rem; background: rgb(114, 114, 242); padding: 0.7rem; border: none; border-radius: 4px; color: white; font-size: larger;">Freeze</button></a>
    <a href="${denyLink}" style="text-decoration: none;"><button style="margin: 2rem; background: rgb(220, 48, 5); padding: 0.7rem; border: none; border-radius: 4px; color: white; font-size: larger;">Deny</button></a>
  `;

  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Account Freeze Request",
    html: noticeHtml,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      // console.log("Email Sent: " + info.response);
    }
  });
};

module.exports = sendBankMail;