import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, phone, goal, interest, status } = body;

        // Create a transporter using environment variables
        // Ensure you set these in your .env.local file
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com', // Default to Gmail if not set
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

        // 1. Send Email to Admin
        try {
            await transporter.sendMail({
                from: `"Bytecode Portal" <${process.env.SMTP_USER}>`,
                to: adminEmail,
                subject: `🔥 New Admission Lead: ${fullName}`,
                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2563eb;">New Student Inquiry</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${fullName}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Status:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${status}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Interest:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${interest}</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Goal:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${goal}</td></tr>
                    </table>
                </div>
            `,
            });
        } catch (adminError) {
            console.error("Failed to send admin notification:", adminError);
            // Continue execution to at least send the user confirmation
        }

        // 2. Send Confirmation Email to User
        await transporter.sendMail({
            from: `"Bytecode Trainings" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'We received your application - Bytecode Trainings',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2563eb;">Hello ${fullName},</h2>
                    <p>Thank you for expressing interest in <strong>${interest}</strong> at Bytecode Trainings.</p>
                    <p>We have received your details and our admission counselor will get in touch with you shortly at <strong>${phone}</strong> to discuss the next steps.</p>
                    <p>If you have any immediate queries, feel free to reply to this email.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><strong>Admissions Team</strong><br>Bytecode Trainings and Placements<br>Hyderabad</p>
                </div>
            `,
        });

        return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending emails:', error);
        return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    }
}
