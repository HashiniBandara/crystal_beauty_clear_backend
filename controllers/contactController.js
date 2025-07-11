import { Contact } from "../models/contact.js";
import nodemailer from "nodemailer";

export const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    
    await Contact.create({ name, email, message });

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #802549;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="margin: 0; padding-left: 15px; border-left: 3px solid #ffc0cb;">
            ${message}
          </blockquote>
          <p style="margin-top: 20px;">Sent from the <strong>Crystal Beauty Clear</strong> website.</p>
        </div>
      `,
    });

    // ✅ Auto-reply to user
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Thank you for reaching out to Crystal Beauty Clear!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Hi <strong>${name}</strong>,</p>

          <p>Thank you for getting in touch with us!</p>
          <p>We've received your message and our team will get back to you as soon as possible.</p>

          <p style="margin-top: 20px;">In the meantime, feel free to explore more of our beauty collections on our website.</p>

          <p>With love,<br/>
          <strong>The Crystal Beauty Clear Team</strong></p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">
            This is an automated reply. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contact messages" });
  }
};

