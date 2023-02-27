namespace ToDoList.Data.Entities;
public class User {
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PasswordHash { get; set; }
    public bool IsArchived { get; set; }
    public DateTime? ArchiveTime { get; set; }
    public string ProfilePicture { get; set; }
    public Role Role { get; set; }
    public string ResetPasswordToken { get; set; }
    public DateTime TokenGenerationTime { get; set; }
    public ICollection<AssignmentList> AssignmentLists { get; set; }
    public ICollection<Reminder> Reminders { get; set; }
}