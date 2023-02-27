namespace ToDoList.Data.Dto.Authentication;

public class GetDetailsForLoginDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Role { get; set; }
    public bool IsArchived { get; set; }
}
