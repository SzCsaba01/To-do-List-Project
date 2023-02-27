namespace ToDoList.Data.Entities;
public class Reminder {
    public Guid Id { get; set; }
    public bool IsSent { get; set; }
    public DateTime Date { get; set; }
    public User User { get; set; }
    public Guid UserId { get; set; }
    public Assignment Assignment { get; set; }
}
