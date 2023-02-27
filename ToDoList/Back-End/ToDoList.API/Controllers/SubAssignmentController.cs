using Microsoft.AspNetCore.Mvc;
using ToDoList.Data.Dto.SubAssignment;
using ToDoList.Services.Contracts;

namespace ToDoList.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class SubAssignmentController : ControllerBase {
    private readonly ISubAssignmentService _subAssignmentService;

    public SubAssignmentController(ISubAssignmentService subAssignmentService) {
        _subAssignmentService = subAssignmentService;
    }

    [HttpPost("Add")]
    public async Task<IActionResult> AddSubAssignmentAsync(AddSubAsignmentDto addSubAsignmentDto) {
        return Ok(await _subAssignmentService.AddSubAssignmentAsync(addSubAsignmentDto));
    }

    [HttpDelete("Delete")]
    public async Task<IActionResult> DeleteSubAssignmentAsync(Guid id) {
        await _subAssignmentService.DeleteSubAssignmentAsync(id);
        return Ok();
    }

    [HttpPut("Update")]
    public async Task<IActionResult> UpdateSubAssignmentAsync(UpdateSubAssignmentDto updateSubAssignmentDto) {
        await _subAssignmentService.UpdateSubAssignmentAsync(updateSubAssignmentDto);
        return Ok();
    }

    [HttpPut("SwitchStatus/{id}")]
    public async Task<IActionResult> SwitchSubAssignmentStatusAsync(string id) {
        Guid guid = new Guid(id);
        await _subAssignmentService.SwitchSubAssignmentStatusAsync(guid);
        return Ok();
    }

    [HttpPut("ChangeAllSubAssignmentStatus")]
    public async Task<IActionResult> ChangeAllSubAssignmentStatus(ChangeAllSubAssignmentStatusDto changeAllSubAssignmentStatusDto) {
        await _subAssignmentService.ChangeAllSubAssignmentStatusAsync(changeAllSubAssignmentStatusDto);
        return Ok();
    }
}
