namespace ToDoList.Data.Dto.Reminder;
public class AddReminderDto {
    public DateTime Date { get; set; }
    public Guid AssignmentId { get; set; }
    public Guid UserId { get; set; }
}
