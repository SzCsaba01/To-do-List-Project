namespace ToDoList.Data.Dto.Email;
public class SendReminderEmailDto {
    public string Email{ get; set; }
    public string UserName{ get; set; }
    public string AssignmentName{ get; set; }
    public DateTime DeadLine{ get; set; }
}
