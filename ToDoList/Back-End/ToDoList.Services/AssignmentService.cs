using Data.Data;
using ToDoList.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoList.API.Infrastructure;
using ToDoList.Data.Dto.Assignment;
using ToDoList.Services.Contracts;
using ToDoList.Data.Mappers;
using ToDoList.Data.Dto.SubAssignment;

namespace ToDoList.Services.Business;

public class AssignmentService : IAssignmentService
{
    private readonly DataContext _dataContext;

    public AssignmentService(DataContext context)
    {
        _dataContext = context;
    }

    public async Task<AssignmentDto> DeleteAssignmentAsync(Guid id)
    {
        var assignmentToDelete = await _dataContext.Assignments.FindAsync(id);

        if(assignmentToDelete is null)
        {
            throw new ModelNotFoundException("Assignment not found");
        }

        var reminder = await _dataContext.Reminders
                            .Where(r => r.Assignment.Id == assignmentToDelete.Id)
                            .Select(r => r.Date)
                            .FirstOrDefaultAsync();

        _dataContext.Assignments.Remove(assignmentToDelete);
        await _dataContext.SaveChangesAsync();

        return new AssignmentDto
        {
            Id = assignmentToDelete.Id,
            Name = assignmentToDelete.Name,
            Status = assignmentToDelete.Status,
            Deadline = assignmentToDelete.Deadline,
            Reminder = reminder
        };
    }

    public async Task<ActionResult<AssignmentDto>> FindAssignmentByNameAsync(string name)
    {
        var assignmentDto = await _dataContext.Assignments
            .Select(a => new AssignmentDto
            {   
                Id = a.Id,
                Name = a.Name,
                Deadline = a.Deadline,
                Status = a.Status
            }
            ).FirstOrDefaultAsync(a => a.Name == name);
        if (assignmentDto is null)
        {
            throw new ModelNotFoundException("Assignment not found");
        }

        return assignmentDto;
    }
    public async Task<IEnumerable<AssignmentDto>> GetAllAssignmentsAsync()
    {
        return await _dataContext.Assignments
            .Select(a => new AssignmentDto
            {
                Id = a.Id,
                Name = a.Name,
                Deadline = a.Deadline,
                Status = a.Status
            }
            ).ToListAsync();
    }

    public async Task<AssignmentDto> CreateAssignmentAsync(CreateAssignmentDto createAssignment)
    {
        var listForAssignment = await _dataContext.AssignmentLists.FindAsync(createAssignment.AssignmentListId);

        if(listForAssignment is null)
        {
            throw new ModelNotFoundException("Assignment List not found");
        }

        var reminder = new Reminder
        {
            Date = createAssignment.ReminderDate,
            UserId = createAssignment.UserId 
        };

        var newAssignment = new Assignment
        {
            Id = new Guid(),
            Name = createAssignment.Name,
            Deadline = createAssignment.Deadline,
            Status = createAssignment.Status,
            AssignmentList = listForAssignment,
            Reminders = new List<Reminder> { reminder}
        };

        await _dataContext.Assignments.AddAsync(newAssignment);
        await _dataContext.SaveChangesAsync();

        return new AssignmentDto {
            Id = newAssignment.Id,
            Name = newAssignment.Name,
            Status = newAssignment.Status,
            Deadline = newAssignment.Deadline,
            Reminder = reminder.Date
        };
    }

    public async Task<AssignmentDto> UpdateAssignmentAsync(UpdateAssignmentDto assignmentToUpdate)
    {
        var updatedAssignment = await _dataContext.Assignments
            .Include(a => a.AssignmentList)
            .Include(a => a.Reminders)
            .FirstOrDefaultAsync(a => a.Id == assignmentToUpdate.AssignmentId);
            
        if(updatedAssignment is null)
        {
            throw new ModelNotFoundException("Assignment not found");
        }

        if(updatedAssignment.AssignmentList is null)
        {
            throw new ModelNotFoundException("List not found");
        }

        var reminder = await _dataContext.Reminders
            .Include(x => x.User)
            .Include(x => x.Assignment)
            .Where(a => a.User.Id.Equals(assignmentToUpdate.UserId) && a.Assignment.Id.Equals(assignmentToUpdate.AssignmentId))
            .FirstOrDefaultAsync();

        if (reminder is null)
        {
            throw new ModelNotFoundException("Reminder not found");
        }

        reminder.Date = assignmentToUpdate.Reminder;
        _dataContext.Reminders.Update(reminder);

        updatedAssignment.Name = assignmentToUpdate.Name;
        updatedAssignment.Deadline = assignmentToUpdate.Deadline;

        _dataContext.Assignments.Update(updatedAssignment);
        await _dataContext.SaveChangesAsync();

        return new AssignmentDto
        {
            Id = updatedAssignment.Id,
            Name = updatedAssignment.Name,
            Status = updatedAssignment.Status,
            Deadline = updatedAssignment.Deadline,
            Reminder = reminder.Date
        };
    }

    public async Task<bool> UpdateAssignmentStatusAsync(Guid id)
    {
        var updated = await _dataContext.Assignments
            .FindAsync(id);

        if (updated is null)
        {
            throw new ModelNotFoundException("The assignment doesn't exist");
        }

        updated.Status = !updated.Status;

        if (updated.Status) {
            updated.CompletionTime = DateTime.UtcNow;
        }
        else {
            updated.CompletionTime = null;
        }

        await _dataContext.SaveChangesAsync();

        return updated.Status;
    }
    public async Task<Assignment>  GetAssignmentByIdAsync(Guid Id) {

        var assignment = await _dataContext.Assignments.Include(a => a.Reminders).FirstOrDefaultAsync(a => a.Id.Equals(Id));

        if(assignment is null){
            throw new ModelNotFoundException("Assignment not found");
        }

        return assignment;
    }

    public async Task<IList<AssignmentDto>> GetUserAssignmentsFromAssignmentListIdAsync(UserAssignmentsFromList userAssignmentsFromList)
    {
        var userId = await _dataContext.Users
            .Where(u => u.Id == userAssignmentsFromList.UserId)
            .Select(u => u.Id)
            .FirstOrDefaultAsync();

        if (userId == Guid.Empty)
        {
            throw new ModelNotFoundException("User not found");
        }

        var assignmentList = await _dataContext.AssignmentLists
            .Where(al => al.Users.Select(u => u.Id).Contains(userId))
            .FirstOrDefaultAsync(a => a.Id.Equals(userAssignmentsFromList.AssignmentListId));

        if (assignmentList is null)
        {
            throw new ModelNotFoundException("List not found");
        }

        return await _dataContext.Assignments
            .Where(a => a.AssignmentList.Equals(assignmentList))
            .Select(a => new AssignmentDto {
                Id = a.Id,
                Name = a.Name,
                Status = a.Status,
                Deadline = a.Deadline,
                Reminder = a.Reminders
                        .Where(r => r.User.Id == userAssignmentsFromList.UserId)
                        .Select(r => r.Date)
                        .FirstOrDefault(),
                subAssignmentDto = a.SubAssignments
                                    .Select(sa => new SubAssignmentDto {
                                                Id = sa.Id,
                                                Name = sa.Name,
                                                Status = sa.Status
                                    })
                                    .ToList()
            })
            .ToListAsync();
    }

    public async Task<IList<AssignmentForExcelDto>> GetUserAssignmentsForExcelAsync(UserAssignmentsFromList userAssignmentsFromList)
    {
        var assignments = await GetUserAssignmentsFromAssignmentListIdAsync(userAssignmentsFromList);

        return assignments
             .Select(a => new AssignmentForExcelDto
             {
                 Name = a.Name,
                 Deadline = a.Deadline,
                 Status = a.Status
             })
             .ToList();
    }

    public async Task<int> GetNumberOfAssignmentsByAssignmentTypeForUserAsync(NumberOfAssignmentsDto numberOfAssignmentsDto)
    {
        var assignmentLists = await _dataContext.AssignmentLists
                            .Include(al => al.Users)
                            .Where(al => al.ListType.Type == numberOfAssignmentsDto.ListType && al.Users.Select(u => u.Id).Contains(numberOfAssignmentsDto.UserId))
                            .Select(al => al.Assignments)
                            .ToListAsync();

        if (assignmentLists is null){
            throw new ModelNotFoundException("There are no assignments");
        }

        var assignmentCount = 0;
        foreach(var assignments in assignmentLists)
        {
            assignmentCount += assignments.Count;
        }

        return assignmentCount;
    }

    public async Task<int> GetNumberOfCompletedAssignmentsTodayByAssignmentTypeForUserAsync(NumberOfAssignmentsDto numberOfAssignmentsDto) {
        var assignmentLists = await _dataContext.AssignmentLists
                            .Include(al => al.Users)
                            .Where(al => al.ListType.Type == numberOfAssignmentsDto.ListType && al.Users.Select(u => u.Id).Contains(numberOfAssignmentsDto.UserId))
                            .Select(al => al.Assignments)
                            .ToListAsync();

        if (assignmentLists is null) {
            throw new ModelNotFoundException("There are no assignments");
        }

        var assignmentCount = 0;
        foreach (var assignments in assignmentLists) {
            foreach(var assignment in assignments) {
                if (!assignment.CompletionTime.HasValue) {
                    continue;
                }

                DateTime completionTime = assignment.CompletionTime.Value;

                TimeSpan ts = DateTime.UtcNow - completionTime;

                if(ts.Days == 0) {
                    assignmentCount++;
                }
            }
        }

        return assignmentCount;
    }

    public async Task<IList<AssignmentDto>> OrderAssignmnetsByDeadlineAndStatusAsync(UserAssignmentsFromList userAssignmentsFromList)
    {
        var userId = await _dataContext.Users
            .Where(u => u.Id == userAssignmentsFromList.UserId)
            .Select(u => u.Id)
            .FirstOrDefaultAsync();

        if (userId == Guid.Empty)
        {
            throw new ModelNotFoundException("User not found");
        }

        var assignmentList = await _dataContext.AssignmentLists
            .Where(al => al.Users.Select(u => u.Id).Contains(userId))
            .FirstOrDefaultAsync(a => a.Id.Equals(userAssignmentsFromList.AssignmentListId));

        if (assignmentList is null)
        {
            throw new ModelNotFoundException("List not found");
        }

        return await _dataContext.Assignments
            .Where(a => a.AssignmentList.Equals(assignmentList))
            .Select(a => new AssignmentDto
            {
                Id = a.Id,
                Name = a.Name,
                Status = a.Status,
                Deadline = a.Deadline,
                Reminder = a.Reminders
                        .Where(r => r.User.Id == userAssignmentsFromList.UserId)
                        .Select(r => r.Date)
                        .FirstOrDefault(),
                subAssignmentDto = a.SubAssignments
                                    .Select(sa => new SubAssignmentDto
                                    {
                                        Id = sa.Id,
                                        Name = sa.Name,
                                        Status = sa.Status
                                    })
                                    .ToList()
            })
            .OrderBy(a => a.Status)
            .ThenBy(a => a.Deadline)
            .ToListAsync();
    }
}