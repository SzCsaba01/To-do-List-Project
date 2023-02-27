using ToDoList.Data.Dto.User;
using ToDoList.Data.Entities;

namespace ToDoList.Data.Mappers;
public static class UserMappings {
    public static User ToUser(this AddUserDto dto) {
        return new User {
            UserName = dto.UserName,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            IsArchived = false,
            PasswordHash = dto.Password,
            ProfilePicture = string.Empty,
            ResetPasswordToken = string.Empty,
        };
    }
    
    public static UserDto ToUserDto(this User user) {
        return new UserDto {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            ProfilePicture = user.ProfilePicture,
            UserName = user.UserName
        };
    }
}