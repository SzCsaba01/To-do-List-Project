using ToDoList.Data.Dto.Reminder;
using ToDoList.Data.Entities;

namespace ToDoList.Data.Mappers;
public static class ReminderMapping {
    
    public static Reminder ToAddReminder(this AddReminderDto addReminderDto, User user, Assignment assignment) {
        return new Reminder {
            Date = addReminderDto.Date,
            User = user,
            Assignment = assignment,
            IsSent = false,
        };
    }
}
