const express = require("express");
const fs = require("fs");
const { parseString } = require("xml2js");
const cors = require("cors");
const nodemailer = require("nodemailer");

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  auth: {
    api_key: "0a688b4a-9f9748c1",
    domain: "sandboxa5a71c46e50547d781c747ce45e38eed.mailgun.org",
  },
});

app.get("/api/vacancies", (req, res) => {
  fs.readFile("dataXML/example_1.xml", "utf8", (err, data) => {
    parseString(data, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Ошибка отправки" });
        return;
      }

      const vacancies = result; //
      res.json(vacancies);
      console.log();
    });
  });
});

app.post("/send-email", (req, res) => {
  console.log("Received POST request at /send-email");
  const { surname, name, patronymic, email, phone } = req.body;
  console.log(req.body);

  const mailOptions = {
    to: "nasybulindk@social.mos.ru, PimenovVY@social.mos.ru",
    subject: "Новый отклик на вакансию",
    text: `Фамилия: ${surname}\nИмя: ${name}\nОтчество: ${patronymic}\nEmail: ${email}\nТелефон: ${phone}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Email error:", error);
      res.status(500).json({ error: "Ошибка отправки" });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ success: "Письмо отправлено" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
