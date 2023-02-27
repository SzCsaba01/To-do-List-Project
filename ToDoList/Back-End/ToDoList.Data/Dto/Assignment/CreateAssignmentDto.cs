namespace ToDoList.Data.Dto.Assignment;

public class CreateAssignmentDto
{
    public string Name { get; set; }
    public DateTime Deadline { get; set; }
    public bool Status { get; set; }
    public Guid AssignmentListId { get; set; }
    public DateTime ReminderDate { get; set; }
    public Guid UserId { get; set; }
}
