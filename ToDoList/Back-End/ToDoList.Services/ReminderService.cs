using Data.Data;
using Microsoft.EntityFrameworkCore;
using ToDoList.API.Infrastructure;
using ToDoList.Data;
using ToDoList.Data.Dto.Email;
using ToDoList.Data.Dto.Reminder;
using ToDoList.Data.Entities;
using ToDoList.Data.Mappers;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class ReminderService : IReminderService{

	private readonly DataContext _dataContext;
	private readonly IEmailService _emailService;
	private readonly IUserService _userServices;
	private readonly IAssignmentService _assignmentService;

	public ReminderService(DataContext dataContext, IEmailService emailService, IUserService userServices, IAssignmentService assignmentService) {
		_dataContext = dataContext;
		_emailService = emailService;
		_userServices = userServices;
		_assignmentService = assignmentService;
	}

	public async Task<DateTime> AddReminderAsync(AddReminderDto addReminderDto) {

		Assignment assignment;
		User user;

        try {

			assignment = await _assignmentService.GetAssignmentByIdAsync(addReminderDto.AssignmentId);
			user = await _userServices.GetUserByIdAsync(addReminderDto.UserId);
		}catch(Exception ex){
			throw new ModelNotFoundException(ex.Message);
		}

		Reminder reminder = ReminderMapping.ToAddReminder(addReminderDto, user, assignment);

		await _dataContext.Reminders.AddAsync(reminder);
		assignment.Reminders.Add(reminder);
		user.Reminders.Add(reminder);
		await _dataContext.SaveChangesAsync();

		return reminder.Date;
	}

	public async Task EditReminderAsync(EditReminderDto editReminderDto) {

		var reminder = await _dataContext.Reminders.FindAsync(editReminderDto.Id);

		if(reminder is null) {
			throw new ModelNotFoundException("Reminder not found");
		}

		reminder.IsSent = editReminderDto.IsSent;
		reminder.Date = editReminderDto.Date;

		await _dataContext.SaveChangesAsync();
	}

	public async Task<DateTime> EditReminderByUserandAssignmentIdAsync(AddReminderDto editReminderDto)
	{
		var reminder = await _dataContext.Reminders
			.Include(x => x.User)
			.Include(x => x.Assignment)
			.Where(a => a.User.Id.Equals(editReminderDto.UserId) && a.Assignment.Id.Equals(editReminderDto.AssignmentId))
			.FirstOrDefaultAsync();

		if(reminder is null)
        {
			throw new ModelNotFoundException("Reminder not found");
        }

		reminder.Date = editReminderDto.Date;
		_dataContext.Reminders.Update(reminder);
		await _dataContext.SaveChangesAsync();

		return reminder.Date;
	}

	public async Task RemoveReminderAsync(Guid reminderId) {

		var reminder = await _dataContext.Reminders
			.Include(r => r.User)
			.Include(r => r.Assignment)
			.FirstOrDefaultAsync(u => u.Id.Equals(reminderId));

		if(reminder is null) {
			throw new ModelNotFoundException("Reminder not found");
		}

		reminder.Assignment.Reminders.Remove(reminder);
		reminder.User.Reminders.Remove(reminder);
		_dataContext.Reminders.Remove(reminder);

		await _dataContext.SaveChangesAsync();
	}

	public async Task VerifyReminderAsync() {

		var reminders = _dataContext.Reminders
			.Include(u => u.User)
			.Include(a => a.Assignment)
			.Where(r => !r.IsSent);

		DateTime time = DateTime.Now;

		foreach(var reminder in reminders) {

			TimeSpan timeSpan = time - reminder.Date;

			if (timeSpan.TotalMinutes < Constants.REMINDER_TIMER) {
				continue;
			}

			SendReminderEmailDto sendReminderEmailDto = EmailMapping.ToSendReminderEmailDto(reminder.User, reminder.Assignment);
			await _emailService.SendReminderEmailAsync(sendReminderEmailDto);

			reminder.IsSent = true;
		}

		await _dataContext.SaveChangesAsync();
    }
}
