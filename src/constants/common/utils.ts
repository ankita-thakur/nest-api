const nodemailer = require("nodemailer");
import { Injectable } from '@nestjs/common';
import { logger } from 'config/logger';
import { api_response } from 'constants/utility/response';

const transporter = nodemailer.createTransport({
	service: "Gmail",
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "w069485@gmail.com",
		pass: "nhyg vixw tsnc cxxv",
	},
});

@Injectable()
export class SendEmailService {
	sendEmail(email, subject, message="You are invited to this event") {
		try {
		const mailOptions = {
			from: "w069485@gmail.com",
			to: email,
			subject: subject,
			text: message,
		};
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error("Error sending email: ", error);
			} else {
				console.log("Email sent: ", info.response);
			}
		});
		logger.info("Email sent successfully")
		return api_response([], 200, "Email sent successfully")
	} catch(error) {
		logger.error(error)
		return api_response([], 400, "")
	}
	}
}