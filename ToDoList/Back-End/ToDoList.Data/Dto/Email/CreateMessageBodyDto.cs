namespace ToDoList.Data.Dto.Email;
public class CreateMessageBodyDto {
    public string UserName{ get; set; }
    public string AssignmentName{ get; set; }
    public DateTime Deadline{ get; set; }
}
