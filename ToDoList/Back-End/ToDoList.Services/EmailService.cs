using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using ToDoList.Data;
using ToDoList.Data.Dto.Email;
using ToDoList.Data.Mappers;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class EmailService : IEmailService {
    private IConfiguration _config;

    public EmailService(IConfiguration config) {
        _config = config;
    }

    public string CreateMessageBody(CreateMessageBodyDto createMessageBodyDto) {
        var bodyBuilder = 
            $"<h>Dear {createMessageBodyDto.UserName}</h>" +
            "<br><br>" +
            $"You have an assignment {createMessageBodyDto.AssignmentName} to do until {createMessageBodyDto.Deadline}" +
            "<br><br>";

        return bodyBuilder;
    }

    public string CreateForgotPasswordMessageBody(SendForgotPasswordEmailDto sendForgotPasswordEmailDto) {
        var bodyBuilder =
            $"You have {Constants.TOKEN_VALIDATION_TIME} minutes to click the link and reset your password " +
            $"<a href={sendForgotPasswordEmailDto.Uri}>link</a>";

        return bodyBuilder;
    }

    public async Task SendReminderEmailAsync(SendReminderEmailDto sendReminderEmailDto) {

        var apiKey = _config["SendGrid:ApiKey"];
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress(_config["SendGrid:Email"]);
        var subject = $"ToDoList {sendReminderEmailDto.AssignmentName} reminder";
        var to = new EmailAddress(sendReminderEmailDto.Email, sendReminderEmailDto.UserName);
        var plainTextContent = "";

        CreateMessageBodyDto createMessageBodyDto = EmailMapping.ToCreateMessageBodyDto(sendReminderEmailDto);
        var htmlContent = CreateMessageBody(createMessageBodyDto);

        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

        var response = await client.SendEmailAsync(msg);

    }

    public async Task SendForgotPasswordEmailAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto) {
        var apiKey = _config["SendGrid:ApiKey"];
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress(_config["SendGrid:Email"]);
        var subject = $"ToDoList Forgot Password";
        var to = new EmailAddress(sendForgotPasswordEmailDto.Email);
        var plainTextContent = "";

        sendForgotPasswordEmailDto.Uri = Path.Combine(Constants.FE_APP_URL, sendForgotPasswordEmailDto.Token);
        var htmlContent = CreateForgotPasswordMessageBody(sendForgotPasswordEmailDto);

        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

        var response = await client.SendEmailAsync(msg);
    }


}
