using ToDoList.Data.Dto.Authentication;
using ToDoList.Data.Dto.File;

namespace ToDoList.Services.Contracts;
public interface IFileService {
    Task UploadFileAsync(FileDto fileDto);
    Task<string> GetFileUrlByUserIdAsync(Guid Id);
}
