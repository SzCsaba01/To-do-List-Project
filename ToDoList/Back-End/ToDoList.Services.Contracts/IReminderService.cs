using ToDoList.Data.Dto.Reminder;

namespace ToDoList.Services.Contracts;
public interface IReminderService {
    Task VerifyReminderAsync();
    Task<DateTime> AddReminderAsync(AddReminderDto addReminderDto);
    Task RemoveReminderAsync(Guid reminderId);
    Task EditReminderAsync(EditReminderDto editReminderDto);
    Task<DateTime> EditReminderByUserandAssignmentIdAsync(AddReminderDto editReminderDto);
}
