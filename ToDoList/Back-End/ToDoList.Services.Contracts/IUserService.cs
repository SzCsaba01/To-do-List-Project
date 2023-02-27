using ToDoList.Data.Dto.Email;
using ToDoList.Data.Dto.User;
using ToDoList.Data.Entities;

namespace ToDoList.Services.Contracts;
public interface IUserService {
    Task<UserPaginationDto> GetUsersPaginatedAsync(int page);
    Task AddUserAsync(AddUserDto request);
    Task<bool> VerifyExistingUserNameAsync(string request);
    Task<bool> VerifyExistingEmailAsync(string request);
    Task DeleteUserAsync(string userName);
    Task EditUserAsycn(EditUserDto request);
    Task ResetPasswordAsync(ResetPasswordDto request);
    Task SwitchArchiveStatusAsync(string userName);
    Task<User> GetUserByIdAsync(Guid id);
    Task<IList<string>> GetUsersByAssignmentListIdAsync(Guid assignmentListId);
    Task<UserDto> GetUserDetailsAsync(Guid id);
    Task<UserPaginationDto> GetSearchedUsersByUserNameAsync(UserSearchDto userSearchDto);
    Task<UserPaginationDto> GetSearchedUsersByEmailAsync(UserSearchDto userSearchDto);
    Task ForgotPasswordAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto);
    Task<Guid> GetUserIdWithResetPasswordTokenAsync(string token);
    Task DeleteArchivedUsersAsync();
}

