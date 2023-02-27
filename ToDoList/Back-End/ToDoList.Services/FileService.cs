using Data.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using ToDoList.API.Infrastructure;
using ToDoList.Data;
using ToDoList.Data.Dto.File;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class FileService : IFileService {
    private readonly DataContext _dataContext;

    public FileService(DataContext dataContext) {
        _dataContext = dataContext;
    }

    public async Task<string> GetFileUrlByUserIdAsync(Guid Id) {
        var fileUrl = await _dataContext.Users
            .Where(u => u.Id == Id)
            .Select(u => u.ProfilePicture)
            .FirstOrDefaultAsync();

        if(fileUrl is null) {
            throw new ModelNotFoundException("Profile Picture not found");
        }

        var fullPath = Path.Combine(Constants.APP_URL, fileUrl);

        return fullPath;
    }

    public async Task UploadFileAsync(FileDto fileDto) {
        var file = fileDto.File;
        var folderName = Path.Combine(Constants.RESOURCES, Constants.IMAGES);
        var pathToSave = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, Constants.RESOURCE_FOLDER, folderName); 

        if(file.Length <= 0) {
            throw new ModelNotFoundException("File not found");
        }

        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim().ToString();
        var fullPath = Path.Combine(pathToSave, fileName);
        var dbPath = Path.Combine(folderName, fileName);

        var oldFile = await _dataContext.Users
            .Where(u => u.Id == fileDto.UserId)
            .Select(u => u.ProfilePicture)
            .FirstOrDefaultAsync();

        if(oldFile is not null) {

            oldFile = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, Constants.RESOURCE_FOLDER, oldFile);

            if(File.Exists(oldFile)) {
                File.Delete(oldFile);
            }
        }

        using (var stream = new FileStream(fullPath, FileMode.Create)) {
            file.CopyTo(stream);
        }

        var user = await _dataContext.Users.FindAsync(fileDto.UserId);

        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        user.ProfilePicture = dbPath;
        await _dataContext.SaveChangesAsync();
    }
}
