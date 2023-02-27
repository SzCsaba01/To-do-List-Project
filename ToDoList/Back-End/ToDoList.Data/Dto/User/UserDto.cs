namespace ToDoList.Data.Dto.User;
public class UserDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsArchived { get; set; }
    public string Email { get; set; }
    public string ProfilePicture { get; set; }
}