using Microsoft.AspNetCore.Http;

namespace ToDoList.Data.Dto.File;
public class FileDto {
    public Guid UserId { get; set; }
    public IFormFile File { get; set; }
}
