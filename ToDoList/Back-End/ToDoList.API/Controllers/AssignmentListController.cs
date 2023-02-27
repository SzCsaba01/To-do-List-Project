using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoList.Data.Dto.AssignmentList;
using ToDoList.Data.Dto.AssignmentListUser;
using ToDoList.Data.Dto.ListType;
using ToDoList.Services.Contracts;

namespace ToDoList.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssignmentListController : ControllerBase
{
    private readonly IAssignmentListService _assignmentListService;

    public AssignmentListController(IAssignmentListService assignmentListService)
    {
        _assignmentListService = assignmentListService;
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllAssignmentListsAsync()
    {
        return Ok(await _assignmentListService.GetAllAssignmentListsAsync());
    }


    [HttpPost("filterByListTypeAsync")]
    public async Task<IActionResult> FilterByListTypeAsync(ListTypeOfUserDto listTypeOfUser)
    {
        return Ok(await _assignmentListService.GetAllAssignmentListsByListTypeAsync(listTypeOfUser));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        return Ok(await _assignmentListService.GetAssignmentListByIdAsync(id));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAssignmentListAsync(Guid id)
    {
        await _assignmentListService.DeleteAssignmentListAsync(id);
        return NoContent();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAssignmentListAsync(UpdateAssignmentListDto assignmentListModel)
    {
        return Ok(await _assignmentListService.UpdateAssignmentListAsync(assignmentListModel));
    }

    [HttpPut("convertToShared")]
    public async Task<IActionResult> ConvertPrivateToSharedAssignmentList(Guid assignmentListId)
    {
        await _assignmentListService.ConvertPrivateToSharedAssignmentList(assignmentListId);
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAssignmentListAsync(CreateAssingmentListDto createAssingmentListDto)
    {
        return Ok(await _assignmentListService.CreateAssignmentListAsync(createAssingmentListDto));
    }

    [HttpPut("addUser")]
    public async Task<IActionResult> AddUserToListByUserId(AssignmentListUserDto assignmentListUserDto)
    {
        return Ok(await _assignmentListService.AddAssignmentListToUser(assignmentListUserDto));
    }

    [HttpGet("getAssignmentListName")]
    public async Task<IActionResult> GetAssignmentListNameAsync(Guid assignmentListId)
    {
        return Ok(await _assignmentListService.GetAssignmentListNameAsync(assignmentListId));
    }

    [HttpDelete("AdministrativeList")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteAdministrativeAssignmentListAsync(Guid id)
    {
        await _assignmentListService.DeleteAssignmentListAsync(id);
        return NoContent();
    }

    [HttpPost("AdministrativeList")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAdministrativeAssignmentListAsync(CreateAssingmentListDto createAssingmentListDto)
    {
        return Ok(await _assignmentListService.CreateAssignmentListAsync(createAssingmentListDto));
    }
    [HttpPut("AdministrativeList")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAdministrativeAssignmentListAsync(UpdateAssignmentListDto assignmentListModel)
    {
        return Ok(await _assignmentListService.UpdateAssignmentListAsync(assignmentListModel));
    }
}

