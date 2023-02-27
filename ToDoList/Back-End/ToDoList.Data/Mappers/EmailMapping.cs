using ToDoList.Data.Dto.Email;
using ToDoList.Data.Entities;

namespace ToDoList.Data.Mappers;
public static class EmailMapping {
    
    public static SendReminderEmailDto ToSendReminderEmailDto(this User user, Assignment assignment) {
        return new SendReminderEmailDto {
            UserName = user.UserName,
            Email = user.Email,
            AssignmentName = assignment.Name,
            DeadLine = assignment.Deadline
        };
    }

    public static CreateMessageBodyDto ToCreateMessageBodyDto(SendReminderEmailDto sendReminderEmailDto) {
        return new CreateMessageBodyDto {
            UserName = sendReminderEmailDto.UserName,
            AssignmentName = sendReminderEmailDto.AssignmentName,
            Deadline = sendReminderEmailDto.DeadLine,
        };
    }
}
