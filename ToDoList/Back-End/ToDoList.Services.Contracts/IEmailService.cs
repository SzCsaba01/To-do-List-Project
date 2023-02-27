using ToDoList.Data.Dto.Email;

namespace ToDoList.Services.Contracts;
public interface IEmailService {
    Task SendReminderEmailAsync(SendReminderEmailDto sendReminderEmailDto);
    Task SendForgotPasswordEmailAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto);
    string CreateForgotPasswordMessageBody(SendForgotPasswordEmailDto sendForgotPasswordEmailDto);
    string CreateMessageBody(CreateMessageBodyDto createMessageBodyDto);
}
