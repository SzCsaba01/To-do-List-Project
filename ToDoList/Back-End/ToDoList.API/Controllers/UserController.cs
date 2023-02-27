using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoList.Data.Dto.Email;
using ToDoList.Data.Dto.File;
using ToDoList.Data.Dto.User;
using ToDoList.Services.Contracts;

namespace ToDoList.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userServices;
    private readonly IFileService _fileService;
    private readonly IWebHostEnvironment _webHostEnvironment;
    public UserController(IUserService userServices, IFileService fileService){
        _userServices = userServices;
        _fileService = fileService;
    }

    [HttpGet("PaginatedUsers")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsersPaginatedAsync(int page)
    {
        return Ok(await _userServices.GetUsersPaginatedAsync(page));
    }

    [HttpPost("Add")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddUserAsync(AddUserDto request){
        await _userServices.AddUserAsync(request);
        return Ok("Succesfully added a new User");
    }

    [HttpDelete("Delete")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUserAsync(string userName) {
        await _userServices.DeleteUserAsync(userName);
        return NoContent();
    }

    [HttpPut("Edit")]
    public async Task<IActionResult> EditUserAsync(EditUserDto editUserDto) {
        await _userServices.EditUserAsycn(editUserDto);
        return Ok("Succesfully edited your profile");
    }

    [HttpPut("ResetPassword")]
    public async Task<IActionResult> ResetPasswordAsync(ResetPasswordDto request) {
        await _userServices.ResetPasswordAsync(request);
        return Ok("Successfully changed your password");
    }

    [HttpPut("ForgotPassword")]
    public async Task<IActionResult> ForgotPasswordAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto) {
        await _userServices.ForgotPasswordAsync(sendForgotPasswordEmailDto);
        return Ok("Email has been sent succesfully");
    }

    [HttpPut("SwitchArchiveStatus")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ArchiveUserAsync(string userName) {
        await _userServices.SwitchArchiveStatusAsync(userName);
        return Ok("Succesfully archived the user! The user will be permanently deleted after 1 day!");
    }

    [HttpGet("getUsersByAssignmentListId")]
    public async Task<IActionResult> GetUsersByAssignmentListIdAsync(Guid assignmentListId) {
        return Ok(await _userServices.GetUsersByAssignmentListIdAsync(assignmentListId));
    }

    [HttpGet("UserDetails")]
    public async Task<IActionResult> GetUserDetailsAsync(Guid id) {
        return Ok(await _userServices.GetUserDetailsAsync(id));
    }

    [HttpPost("SearchUsersByUserName")]
    public async Task<IActionResult> GetSearchedUsersByUserNameAsync(UserSearchDto userSearchDto) {
        return Ok(await _userServices.GetSearchedUsersByUserNameAsync(userSearchDto));
    }

    [HttpPost("SearchUsersByEmail")]
    public async Task<IActionResult> GetSearchByEmailAsync(UserSearchDto userSearchDto) {
        return Ok(await _userServices.GetSearchedUsersByEmailAsync(userSearchDto));
    }

    [HttpPut("UploadUserProfilePicture")]
    public async Task<IActionResult> UploadFileAsync([FromForm]FileDto fileDto) {
        await _fileService.UploadFileAsync(fileDto);
        return Ok("Succesfully changed the profile Picture");
    }

    [HttpGet("GetFileUrl")]
    public async Task<IActionResult> GetFileUrlByUserIdAsync(Guid Id) {
        return Ok(await _fileService.GetFileUrlByUserIdAsync(Id));
    }

    [HttpGet("GetUserIdWithResetPasswordToken")]
    public async Task<IActionResult> GetUserIdWithResetPasswordToken(string token) {
        return Ok(await _userServices.GetUserIdWithResetPasswordTokenAsync(token));
    }
}
