namespace ToDoList.Data.Dto.Reminder;
public class EditReminderDto {
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public bool IsSent { get; set; }
}