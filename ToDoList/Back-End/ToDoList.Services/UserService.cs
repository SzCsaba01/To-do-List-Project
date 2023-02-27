using Data.Data;
using Microsoft.EntityFrameworkCore;
using ToDoList.API.Infrastructure;
using ToDoList.Data;
using ToDoList.Data.Dto.Email;
using ToDoList.Data.Dto.User;
using ToDoList.Data.Entities;
using ToDoList.Data.Mappers;
using ToDoList.Services.Business.Exceptions;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class UserService : IUserService
{

    private readonly DataContext _dataContext;
    private readonly IEncryptionService _encryptionService;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;

    public UserService(DataContext dataContext, IEncryptionService encryptionService, ITokenService tokenService, IEmailService emailService)
    {
        _dataContext = dataContext;
        _encryptionService = encryptionService;
        _tokenService = tokenService;
        _emailService = emailService;
    }

    public async Task<bool> VerifyExistingEmailAsync(string email)
    {

        var user = await _dataContext.Users.Select(u => u.Email).FirstOrDefaultAsync(u => u.Equals(email));

        if (user is null)
        {
            return false;
        }

        return true;
    }

    public async Task<bool> VerifyExistingUserNameAsync(string userName)
    {

        var user = await _dataContext.Users.Select(u => u.UserName).FirstOrDefaultAsync(u => u.Equals(userName));

        if (user is null)
        {
            return false;
        }

        return true;
    }

    public async Task AddUserAsync(AddUserDto addUserDto)
    {

        if (await VerifyExistingUserNameAsync(addUserDto.UserName) || await VerifyExistingEmailAsync(addUserDto.Email))
        {
            throw new AlreadyExistsException("Username or Email already exists");
        }

        User newUser = UserMappings.ToUser(addUserDto);
        var role = await _dataContext.Roles.FirstOrDefaultAsync(r => r.Name.Equals("user"));
        if (role is null)
        {
            throw new ModelNotFoundException("Role not found");
        }
        newUser.Role = role;

        newUser.PasswordHash = _encryptionService.GetHashPassword(newUser.PasswordHash);

        await _dataContext.Users.AddAsync(newUser);
        await _dataContext.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(string userName)
    {

        var deleteUser = await _dataContext.Users
            .Where(u => u.UserName.Equals(userName))
            .FirstOrDefaultAsync();

        if (deleteUser is null || deleteUser.IsArchived == true)
        {
            throw new ModelNotFoundException("User not found or User is Archived");
        }

        _dataContext.Users.Remove(deleteUser);
        await _dataContext.SaveChangesAsync();
    }

    public async Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {

        var user = await _dataContext.Users.FindAsync(resetPasswordDto.Id);
        
        if (user is null || user.IsArchived)
            throw new ModelNotFoundException("User not found");

        TimeSpan ts = DateTime.UtcNow - user.TokenGenerationTime;

        if(ts.TotalMinutes > Constants.TOKEN_VALIDATION_TIME) {
            throw new ModelNotFoundException("The reset password link has expired");
        }

        if (!resetPasswordDto.NewPassword.Equals(resetPasswordDto.RepeatNewPassword))
            throw new PasswordException("Passwords are different");

        string newPassword = _encryptionService.GetHashPassword(resetPasswordDto.NewPassword);

        if (user.PasswordHash.Equals(newPassword))
            throw new PasswordException("This is the old password! Enter another one!");

        user.PasswordHash = newPassword;
        await _dataContext.SaveChangesAsync();
    }

    public async Task SwitchArchiveStatusAsync(string userName)
    {

        var user = await _dataContext.Users
            .FirstOrDefaultAsync(u => u.UserName.Equals(userName));

        if (user is null)
        {
            throw new ModelNotFoundException("User not found");
        }

        user.IsArchived = !user.IsArchived;
        if(user.IsArchived){
            user.ArchiveTime = DateTime.UtcNow;
        }
        else{
            user.ArchiveTime = null;
        }

        await _dataContext.SaveChangesAsync();
    }
    public async Task<UserPaginationDto> GetUsersPaginatedAsync(int page)
    {
        var pageResults = 10f;
        var pageCount = Math.Ceiling(_dataContext.Users.Count() / pageResults);

        if(page < 1) {
            page = 1;
        }

        if(page > (int)pageCount) {
            page = (int)pageCount;
        }

        var users = await _dataContext.Users
            .Skip((page-1) * (int) pageResults)
            .Take((int)pageResults)
            .Select(u => new GetUserDto
            {
                UserName = u.UserName,
                Email = u.Email,
                IsArchived = u.IsArchived,
                FirstName = u.FirstName,
                LastName = u.LastName
            }
            ).ToListAsync();

        if(users is null) {
            throw new ModelNotFoundException("Users not found");
        }

        var userPaginationDto = new UserPaginationDto {
            getUserDto = users,
            NumberOfUsers = _dataContext.Users.Count(),
            NumberOfPages = (int)pageCount,
        };

        return userPaginationDto;
    }

    public async Task<User> GetUserByIdAsync(Guid Id)
    {

        var user = await _dataContext.Users.Include(u => u.Reminders).FirstOrDefaultAsync(u => u.Id.Equals(Id));

        if (user is null)
        {
            throw new ModelNotFoundException("User not found");
        }

        return user;
    }


    public async Task<UserDto> GetUserDetailsAsync(Guid Id)
    {
        var user = await _dataContext.Users
            .Where(u => u.Id == Id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                ProfilePicture = u.ProfilePicture,
                UserName = u.UserName
            })
            .FirstOrDefaultAsync();

        if (user is null)
        {
            throw new ModelNotFoundException("User not found");
        }

        user.ProfilePicture = Path.Combine(Constants.APP_URL, user.ProfilePicture);

        return user;
    }

    public async Task<IList<string>> GetUsersByAssignmentListIdAsync(Guid assignmentListId)
    {
        var users = await _dataContext.Users
            .Where(u => u.AssignmentLists.Select(al => al.Id).Contains(assignmentListId))
            .Select(u => u.UserName)
            .ToListAsync();

        if(users is null)
        {
            throw new ModelNotFoundException("Users for an assignment list not found");
        }

        return users;
    }

    public async Task EditUserAsycn(EditUserDto editUserDto) {
        var user = await _dataContext.Users.FindAsync(editUserDto.Id);

        if(user is null) {
            throw new ModelNotFoundException("User not found");
        }

        if (!user.UserName.Equals(editUserDto.UserName)) {
            if(await VerifyExistingUserNameAsync(editUserDto.UserName)){
                throw new AlreadyExistsException("Username already exists");
            }
            user.UserName = editUserDto.UserName;
        }

        if (!user.Email.Equals(editUserDto.Email)) {
            if(await VerifyExistingEmailAsync(editUserDto.Email)) {
                throw new AlreadyExistsException("Email already exists");
            }
            user.Email = editUserDto.Email;
        }

        user.FirstName = editUserDto.FirstName;
        user.LastName = editUserDto.LastName;
        user.Email = editUserDto.Email;

        await _dataContext.SaveChangesAsync();
    }


    public async Task<UserPaginationDto> GetSearchedUsersByUserNameAsync(UserSearchDto userSearchDto){
        var pageResults = 10d;

        if (userSearchDto.Page < 1) {
            userSearchDto.Page = 1;
        }

        var usersQuery = _dataContext.Users.Where(u => u.UserName.ToLower().Contains(userSearchDto.Search.ToLower()));

        var numberOfUsers = usersQuery.Count();

        var pageCount = Math.Ceiling(numberOfUsers / pageResults);

        if (userSearchDto.Page > (int)pageCount) {
            userSearchDto.Page = (int)pageCount;
        }

        if(numberOfUsers < pageResults) {
            pageResults = numberOfUsers;
        }

        var searchedUsers = await usersQuery
            .Skip((userSearchDto.Page - 1) * (int)pageResults)
            .Take((int)pageResults)
            .Select(u => new GetUserDto {
                UserName = u.UserName,
                Email = u.Email,
                IsArchived = u.IsArchived,
                FirstName = u.FirstName,
                LastName = u.LastName
            }).ToListAsync();

        if (userSearchDto.Page > (int)pageCount) {
            userSearchDto.Page = (int)pageCount;
        }

        var userPaginationDto = new UserPaginationDto {
            getUserDto = searchedUsers,
            NumberOfUsers = numberOfUsers,
            NumberOfPages = (int)pageCount,
        };

        return userPaginationDto;
    }

    public async Task<UserPaginationDto> GetSearchedUsersByEmailAsync(UserSearchDto userSearchDto) {
        var pageResults = 10d;
        
        if (userSearchDto.Page < 1) {
            userSearchDto.Page = 1;
        }

        var usersQuery = _dataContext.Users.Where(u => u.Email.ToLower().Contains(userSearchDto.Search.ToLower()));

        var numberOfUsers = usersQuery.Count();
        var pageCount = Math.Ceiling(numberOfUsers / pageResults);

        if (userSearchDto.Page > (int)pageCount) {
            userSearchDto.Page = (int)pageCount;
        }

        if (numberOfUsers < pageResults) {
            pageResults = numberOfUsers;
        }

        var searchedUsers = await usersQuery
            .Skip((userSearchDto.Page - 1) * (int)pageResults)
            .Take((int)pageResults)
            .Select(u => new GetUserDto {
                UserName = u.UserName,
                Email = u.Email,
                IsArchived = u.IsArchived,
                FirstName = u.FirstName,
                LastName = u.LastName
            }).ToListAsync();

        var userPaginationDto = new UserPaginationDto {
            getUserDto = searchedUsers,
            NumberOfUsers = numberOfUsers,
            NumberOfPages = (int)pageCount,
        };

        return userPaginationDto;
    }

    public async Task ForgotPasswordAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto) {
        var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.Email.Equals(sendForgotPasswordEmailDto.Email));

        if(user is null) {
            throw new ModelNotFoundException("User not found");
        }

        sendForgotPasswordEmailDto.Token = await _tokenService.GenerateRandomTokenAsync() + sendForgotPasswordEmailDto.Email;
        user.ResetPasswordToken = sendForgotPasswordEmailDto.Token;
        user.TokenGenerationTime = DateTime.UtcNow;

        await _dataContext.SaveChangesAsync();
        await _emailService.SendForgotPasswordEmailAsync(sendForgotPasswordEmailDto);
    }

    public async Task<Guid> GetUserIdWithResetPasswordTokenAsync(string token) {
        var user = await _dataContext.Users
            .Where(u => u.ResetPasswordToken.Equals(token))
            .Select(u => new GetUserResetPasswordDto {
                Id = u.Id,
                TokenGenerationTime = u.TokenGenerationTime,
            })
            .FirstOrDefaultAsync();

        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        TimeSpan ts = DateTime.UtcNow - user.TokenGenerationTime;

        if(ts.TotalMinutes > Constants.TOKEN_VALIDATION_TIME) {
            throw new ModelNotFoundException("Token has expired");
        }

        return user.Id;
    }

    public async Task DeleteArchivedUsersAsync() {
        var users = _dataContext.Users;

        DateTime time = DateTime.Now;

        foreach(var user in users) {
            if (!user.ArchiveTime.HasValue) {
                continue;
            }

            DateTime userArchivTime = user.ArchiveTime.Value;

            TimeSpan ts = time - userArchivTime;

            if (ts.TotalMinutes < Constants.DELETE_AFTER_TIME) {
                continue;
            }

            _dataContext.Users.Remove(user);
        }

        await _dataContext.SaveChangesAsync();
    }
}