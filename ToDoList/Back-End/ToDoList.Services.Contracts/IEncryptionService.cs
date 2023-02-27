namespace ToDoList.Services.Contracts;
public interface IEncryptionService {
    public string GetHashPassword(string password);
}
