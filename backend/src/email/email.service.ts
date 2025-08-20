import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) { }
    emailTransport() {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('EMAIL'),
                pass: this.configService.get<string>('PASSWORD')
            },
        })
        return transporter
    }
    async sendEmail(sendEmailDto: SendEmailDto) {
        const { recipients, subject, html } = sendEmailDto

        const transport = this.emailTransport()

        const options: nodemailer.SendMailOptions = {
            from: `"NestJs Backend" <process.env.EMAIL_HOST>`,
            to: recipients,
            subject: subject,
            html: html,
        }

        try {
            await transport.sendMail(options)
            console.log("Email successfully sent!")
        } catch (err) {
            console.log("Error sending mail", err)
        }
    }
}
