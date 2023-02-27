using Microsoft.AspNetCore.Mvc;
using ToDoList.Data.Dto.Reminder;
using ToDoList.Services.Contracts;

namespace ToDoList.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ReminderController : ControllerBase
{

    public readonly IReminderService _reminderService;

	public ReminderController(IReminderService reminderService) 
	{
		_reminderService = reminderService;
	}

	[HttpPost]
	public async Task<IActionResult> AddReminder(AddReminderDto addReminderDto) 
	{
		return Ok(await _reminderService.AddReminderAsync(addReminderDto));
	}

	[HttpDelete]
	public async Task<IActionResult> DeleteReminder(Guid reminderId)
	{	
		await _reminderService.RemoveReminderAsync(reminderId);
		return Ok();
	}

	[HttpPut]
	public async Task<IActionResult> EditReminder(EditReminderDto editReminderDto) 
	{
		await _reminderService.EditReminderAsync(editReminderDto);
		return Ok();
	}

	[HttpPut("editReminderByUserandAssignmentId")]
	public async Task<IActionResult> EditReminderByUserandAssignmentIdAsync(AddReminderDto editReminderDto)
	{
		return Ok(await _reminderService.EditReminderByUserandAssignmentIdAsync(editReminderDto));
	}
}
