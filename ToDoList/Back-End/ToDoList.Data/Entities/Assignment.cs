namespace ToDoList.Data.Entities;
public class Assignment {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public DateTime Deadline { get; set; }
    public DateTime? CompletionTime { get; set; }
    public bool Status { get; set; }
    public AssignmentList AssignmentList { get; set; }
    public ICollection<Reminder> Reminders { get; set; }
    public ICollection<SubAssignment> SubAssignments { get; set; }
}