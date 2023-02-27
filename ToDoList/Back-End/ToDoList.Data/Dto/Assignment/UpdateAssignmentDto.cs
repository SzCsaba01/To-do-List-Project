namespace ToDoList.Data.Dto.Assignment;

public class UpdateAssignmentDto
{
    public Guid AssignmentId { get; set; }
    public string Name { get; set; }
    public DateTime Deadline { get; set; }
    public Guid UserId { get; set; }
    public DateTime Reminder { get; set; }
}
