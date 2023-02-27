using Data.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Authentication;
using ToDoList.API.Infrastructure;
using ToDoList.Data.Dto.Authentication;
using ToDoList.Data.Dto.Authentification;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;

public class AuthenticationService : IAuthenticationService
{
    private readonly IConfiguration _configuration;
    private readonly IJwtService _jwtService;
    private readonly DataContext _dataContext;
    private readonly IEncryptionService _encryptionService;

    public AuthenticationService(IConfiguration configuration, IJwtService jwtService, DataContext dataContext, IEncryptionService encryptionService)
    {
        _configuration = configuration;
        _jwtService = jwtService;
        _dataContext = dataContext;
        _encryptionService = encryptionService;
    }

    public async Task<AuthenticateResponseDto> LoginAsync(AuthenticateRequestDto request)
    {
        var encryptedRequestPassword = _encryptionService.GetHashPassword(request.Password);
        var user = await _dataContext.Users
            .Where(u => u.UserName == request.UserCredentials && u.PasswordHash == encryptedRequestPassword)
            .Select(u => new GetDetailsForLoginDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Role = u.Role.Name,
                IsArchived = u.IsArchived
            })
            .FirstOrDefaultAsync()
            ??
            await _dataContext.Users
                    .Where(u => u.Email == request.UserCredentials && u.PasswordHash == encryptedRequestPassword)
                    .Select(u => new GetDetailsForLoginDto
                    {
                        Id = u.Id,
                        UserName = u.UserName,
                        Role = u.Role.Name,
                        IsArchived = u.IsArchived
                    })
                    .FirstOrDefaultAsync();

        if (user is null)
        {
            throw new ModelNotFoundException("Wrong credentials");
        }

        if (user.IsArchived)
        {
            throw new AuthenticationException("Something went wrong");
        }

        var token = _jwtService.GenerateAuthentificationJwt(user);
        return new AuthenticateResponseDto { Id = user.Id, Role = user.Role, Token = token};
    }
}
