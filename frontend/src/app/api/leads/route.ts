import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { name, email, phone, course, action } = await req.json();
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        // Credentials provided by user
        const EMAIL_USER = 'Bytecodetrainings@gmail.com';
        const EMAIL_PASS = 'hkdx qkxe cdhi eyzm';

        // Data for CSV
        const csvRow = `"${name}","${email}","${phone}","${course}","${action}","${date}","${time}"\n`;
        const filePath = path.join(process.cwd(), 'leads.csv');
        const headers = 'Name,Email,Phone,Course,Action,Date,Time\n';

        // Save to local CSV file
        try {
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, headers);
            }
            fs.appendFileSync(filePath, csvRow);
            console.log(`Lead saved to ${filePath}`);
        } catch (fileError) {
            console.error('Error saving to CSV file:', fileError);
        }

        // Create CSV Attachment Content
        const csvContent = headers + csvRow;

        // Configure Transporter with provided credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });

        const mailOptionsAdmin = {
            from: EMAIL_USER,
            to: EMAIL_USER, // Sending to self as admin
            subject: `New Lead: ${name} - ${course}`,
            text: `New lead received.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCourse: ${course}\nAction: ${action}\nDate: ${date}\nTime: ${time}\n\nThe updated leads sheet containing all student details is attached.`,
            attachments: [
                {
                    filename: 'All_Leads.csv',
                    path: filePath // Attach the full local CSV file
                }
            ]
        };

        const mailOptionsStudent = {
            from: EMAIL_USER,
            to: email,
            subject: `Enrollment Confirmation - ${course}`,
            text: `Hi ${name},\n\nThank you for your interest in ${course}. We have received your details and our team will get back to you shortly.\n\nBest,\nBytecode Team`
        };

        // Send Emails
        try {
            await transporter.sendMail(mailOptionsAdmin);
            await transporter.sendMail(mailOptionsStudent);
            console.log("Emails sent successfully.");
        } catch (emailError) {
            console.error("Error sending emails:", emailError);
            // Don't fail the request if emails fail, just log it.
        }

        return NextResponse.json({ success: true, message: 'Lead captured successfully' });
    } catch (error) {
        console.error('Error capturing lead:', error);
        return NextResponse.json({ success: false, message: 'Failed to capture lead' }, { status: 500 });
    }
}
