using ToDoList.Data.Dto.Authentication;
using ToDoList.Data.Dto.Authentification;

namespace ToDoList.Services.Contracts;

public interface IAuthenticationService
{
    Task<AuthenticateResponseDto> LoginAsync(AuthenticateRequestDto request);
}
