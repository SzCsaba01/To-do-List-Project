namespace ToDoList.Data.Dto.User;

public class GetUserDto
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsArchived { get; set; }
}
