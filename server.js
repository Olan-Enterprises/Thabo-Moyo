const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirnameResolved = __dirname || path.resolve();

app.use(express.static(path.join(__dirnameResolved, "public")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sendPage = (page) => (req, res) => res.sendFile(path.join(__dirnameResolved, "public", `${page}.html`));

app.get("/contact", sendPage("contact"));

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_POST),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify((error, success) => {
    if(error) console.error("SMTP connection error:", error);
    else console.log("SMTP server is ready to send emails.");
});

app.get("/", (req, res) => {
    res.send("Contact form email server is running.");
});

app.post("/contact", async (req, res) => {
    try {
        const { name, email, number, message } = req.body;

        if(!name || !email || !message) return res.status(400).json({ success: false, error: "All fields are required." });

        const mailOptions = {
            from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_RECIPIENT,
            replyTo: email,
            subject: `New message from ${name}`,
            text: `You have a new contact form submission: 
                    Name: ${name}
                    Email: ${email}
                    Number: ${number}
                    Message: ${message}`,
            html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Number:</strong> ${number}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, "<br>")}</p>`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "Message sent successfully."
        });
    }
    catch(error) {
        console.error("Error sending contact email:", error);

        return res.status(500).json({
            success: false,
            error: "Something went wrong while sending the message."
        });
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));