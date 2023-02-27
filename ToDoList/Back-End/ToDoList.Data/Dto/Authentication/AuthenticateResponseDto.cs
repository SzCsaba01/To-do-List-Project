namespace ToDoList.Data.Dto.Authentication;

public class AuthenticateResponseDto
{
    public Guid Id { get; set; }
    public string Role { get; set; }
    public string Token { get; set; }
}
