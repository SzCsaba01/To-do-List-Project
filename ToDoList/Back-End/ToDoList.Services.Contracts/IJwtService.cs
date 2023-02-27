using System.Security.Claims;
using ToDoList.Data.Dto.Authentication;

namespace ToDoList.Services.Business;

public interface IJwtService
{
    string GenerateAuthentificationJwt(GetDetailsForLoginDto user);
    string GenerateJwtToken(ClaimsIdentity claimsIdentity, DateTime expires);
}
