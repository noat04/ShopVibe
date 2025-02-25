using System.Net;
using System.Net.Mail;

namespace EmploymentAdmin.Reponsitory
{
    public class EmailSender : IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            // Gửi email
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("mtoan0547@gmail.com", "khaztwghuklqimfy")
                // Thông tin tài khoản Gmail
            };
            return client.SendMailAsync(
                new MailMessage(from: "mtoan0547@gmail.com", to: email, subject: subject, body: message)
                {
                    IsBodyHtml = true
                });
        }
    }
}
