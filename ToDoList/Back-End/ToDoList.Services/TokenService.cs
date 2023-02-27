using System.Security.Cryptography;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class TokenService : ITokenService {
    public async Task<string> GenerateRandomTokenAsync() {
        return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
    }
}
