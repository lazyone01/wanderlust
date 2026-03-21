const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"Wanderlust Rooms" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html: `
        <h2>Wanderlust Rooms</h2>
        <p>${text}</p>
        <p>Do not share this OTP with anyone.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully to:", to);
    console.log(" Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error(" Email sending failed!");
    console.error("Error details:", error.message);
    console.error("Email:", process.env.EMAIL_USERNAME);
    throw error;  
  }
};


const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  try {
    const { bookingId, roomName, cityName, checkInDate, checkOutDate, numberOfGuests, guestName, totalPrice, nights } = bookingDetails;
    
    const checkInFormatted = new Date(checkInDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const checkOutFormatted = new Date(checkOutDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;"> Booking Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Your reservation is confirmed</p>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="margin-top: 0;">Hi <strong>${guestName}</strong>,</p>
          <p>Thank you for booking with Wanderlust Rooms! Your reservation is confirmed and we're excited to host you.</p>

          <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #333;"> Booking Details</h3>
            <p style="margin: 8px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            <p style="margin: 8px 0;"><strong>Room:</strong> ${roomName}</p>
            <p style="margin: 8px 0;"><strong>City:</strong> ${cityName}</p>
            <p style="margin: 8px 0;"><strong>Check-in:</strong> ${checkInFormatted}</p>
            <p style="margin: 8px 0;"><strong>Check-out:</strong> ${checkOutFormatted}</p>
            <p style="margin: 8px 0;"><strong>Number of Guests:</strong> ${numberOfGuests}</p>
            <p style="margin: 8px 0;"><strong>Duration:</strong> ${nights} night${nights > 1 ? 's' : ''}</p>
          </div>

          <div style="background: #f0f4ff; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;"> Price Summary</h3>
            <p style="margin: 8px 0; font-size: 16px;"><strong>Total Amount:</strong> ₹${totalPrice.toLocaleString('en-IN')}</p>
          </div>

          <p style="margin: 20px 0;">If you have any questions or need to make changes to your booking, please contact us at <strong>support@wanderlust.com</strong>.</p>

          <p style="color: #666; font-size: 12px; margin: 20px 0 0 0; border-top: 1px solid #ddd; padding-top: 20px;">
            This is an automated email. Please do not reply to this email address.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Wanderlust Rooms" <${process.env.EMAIL_USERNAME}>`,
      to: userEmail,
      subject: ` Booking Confirmed - Wanderlust Rooms (ID: ${bookingId})`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Booking confirmation email sent to:", userEmail);
    console.log(" Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error(" Booking confirmation email failed!");
    console.error("Error details:", error.message);
    throw error;
  }
};

module.exports = { sendEmail, sendBookingConfirmationEmail };