using System.Security.Cryptography;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class EncryptionService : IEncryptionService {
    private const string passwordSalt = "F@bRiT!toDoLiSt!";
    public string GetHashPassword(string password) {

        using var hmac = SHA256.Create();
            
        var hashedPassword = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passwordSalt + password));

        return System.Text.Encoding.Default.GetString(hashedPassword);
    }
}
