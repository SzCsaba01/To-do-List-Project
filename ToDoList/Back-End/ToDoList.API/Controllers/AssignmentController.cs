using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoList.Data.Dto.Assignment;
using ToDoList.Services.Contracts;

namespace ToDoList.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssignmentController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;
    private readonly IReminderService _reminderService;
    public AssignmentController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpGet]
    public async Task<IActionResult>GetAllAsync()
    {
        return Ok(await _assignmentService.GetAllAssignmentsAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(Guid assignmentId)
    {
        return Ok(await _assignmentService.GetAssignmentByIdAsync(assignmentId));
    }

    [HttpPost("getUserAssignmentsFromAssignmentList")]
    public async Task<IActionResult> GetUserAssignmentsFromAssignmentListIdAsync(UserAssignmentsFromList userAssignmentsFromList)
    {
        return Ok(await _assignmentService.GetUserAssignmentsFromAssignmentListIdAsync(userAssignmentsFromList));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAssignmentAsync(Guid id)
    {
        return Ok(await _assignmentService.DeleteAssignmentAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> CreateAssignmentAsync(CreateAssignmentDto createdAssignment)
    {
        
        return Ok(await _assignmentService.CreateAssignmentAsync(createdAssignment));           
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAssignmentAsync([FromBody] UpdateAssignmentDto updatedAssignment)
    {
        return Ok(await _assignmentService.UpdateAssignmentAsync(updatedAssignment));
    }

	[HttpPut("ChangeStatus/{id}")]
    public async Task<IActionResult> ChangeAssignmentStatusAsync(string id)
    {
        var guid = new Guid(id);
        return Ok(await _assignmentService.UpdateAssignmentStatusAsync(guid));
    }

    [HttpPost("getUserAssignmentsForExcel")]
    public async Task<IActionResult> GetUserAssignmentsForExcelAsync(UserAssignmentsFromList userAssignmentsFromList)
    {
        return Ok(await _assignmentService.GetUserAssignmentsForExcelAsync(userAssignmentsFromList));
    }

    [HttpPost("GetNumberOfAssignmentsByAssignmentTypeForUser")]
    public async Task<IActionResult> GetNumberOfAssignmentsByAssignmentTypeForUserAsync(NumberOfAssignmentsDto numberOfAssignmentsDto)
    {
        return Ok(await _assignmentService.GetNumberOfAssignmentsByAssignmentTypeForUserAsync(numberOfAssignmentsDto));
    }

    [HttpPost("AddAdministrativeAssignment")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAdministrativeAssignmentAsync(CreateAssignmentDto createdAssignment)
    {

        return Ok(await _assignmentService.CreateAssignmentAsync(createdAssignment));
    }

    [HttpDelete("AdministrativeAssignment")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAdministrativeAssignmentAsync(Guid id)
    {
        return Ok(await _assignmentService.DeleteAssignmentAsync(id));
    }

    [HttpPut("AdministrativeAssignment")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAdministrativeAssignmentAsync([FromBody] UpdateAssignmentDto updatedAssignment)
    {
        return Ok(await _assignmentService.UpdateAssignmentAsync(updatedAssignment));
    }

    [HttpPost("OrderAssignmnetsByDeadlineAndStatusAsync")]
    public async Task<IActionResult> OrderAssignmnetsByDeadlineAndStatusAsync(UserAssignmentsFromList userAssignmentsFromList)
    {
        return Ok(await _assignmentService.OrderAssignmnetsByDeadlineAndStatusAsync(userAssignmentsFromList));
    }

    [HttpPost("GetNumberOfCompletedAssignmentsTodayByAssignmentTypeForUser")]
    public async Task<IActionResult> GetNumberOfCompletedAssignmentsTodayByAssignmentTypeForUserAsync(NumberOfAssignmentsDto numberOfAssignmentsDto) {
        return Ok(await _assignmentService.GetNumberOfCompletedAssignmentsTodayByAssignmentTypeForUserAsync(numberOfAssignmentsDto));
    }
}
