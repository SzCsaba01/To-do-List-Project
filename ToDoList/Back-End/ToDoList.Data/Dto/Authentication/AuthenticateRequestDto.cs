using System.ComponentModel.DataAnnotations;

namespace ToDoList.Data.Dto.Authentification;

public class AuthenticateRequestDto
{
    public string UserCredentials { get; set; }
    public string Password { get; set; }
}
