using Data.Data;
using Microsoft.EntityFrameworkCore;
using ToDoList.API.Infrastructure;
using ToDoList.Data.Dto.SubAssignment;
using ToDoList.Data.Entities;
using ToDoList.Data.Mappers;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class SubAssignmentService : ISubAssignmentService {
    private readonly DataContext _dataContext;

    public SubAssignmentService(DataContext dataContext) {
        _dataContext = dataContext;
    }

    public async Task<SubAssignmentDto> AddSubAssignmentAsync(AddSubAsignmentDto addSubAsignmentDto) {
        var assignment = await _dataContext.Assignments.FindAsync(addSubAsignmentDto.AssignmentId);

        if(assignment is null) {
            throw new ModelNotFoundException("Assignment not found");
        }

        var newSubAssignment = SubAssignmentMapping.ToSubAssignment(addSubAsignmentDto);

        newSubAssignment.Assignment = assignment;
        await _dataContext.SubAssignments.AddAsync(newSubAssignment);
        assignment.SubAssignments.Add(newSubAssignment);
        await _dataContext.SaveChangesAsync();

        return new SubAssignmentDto {
            Id = newSubAssignment.Id,
            Name = newSubAssignment.Name,
            Status = newSubAssignment.Status,
        };
            
    }

    public async Task ChangeAllSubAssignmentStatusAsync(ChangeAllSubAssignmentStatusDto changeAllSubAssignmentStatusDto) {
        var assignment = await _dataContext.Assignments.Include(a => a.SubAssignments).FirstOrDefaultAsync(a => a.Id == changeAllSubAssignmentStatusDto.AssignmentId);

        if(assignment is null) {
            throw new ModelNotFoundException("Task not found");
        }

        foreach (SubAssignment subAssignment in assignment.SubAssignments) {
            subAssignment.Status = changeAllSubAssignmentStatusDto.Status;
        }

        await _dataContext.SaveChangesAsync();
    }

    public async Task DeleteSubAssignmentAsync(Guid id) {
        var subAssignment = await _dataContext.SubAssignments.FindAsync(id);

        if (subAssignment is null) {
            throw new ModelNotFoundException("Assignment not found");
        }

        _dataContext.SubAssignments.Remove(subAssignment);
        await _dataContext.SaveChangesAsync();
    }

    public async Task SwitchSubAssignmentStatusAsync(Guid id) {
        var subAssignment = await _dataContext.SubAssignments.FindAsync(id);
        
        if(subAssignment is null) {
            throw new ModelNotFoundException("SubAssignment not found");
        }

        subAssignment.Status = !subAssignment.Status;
        await _dataContext.SaveChangesAsync();
    }

    public async Task UpdateSubAssignmentAsync(UpdateSubAssignmentDto updateSubAssignmentDto) {
        var subAssignment = await _dataContext.SubAssignments.FindAsync(updateSubAssignmentDto.SubAssignmentId);

        if (subAssignment is null) {
            throw new ModelNotFoundException("SubAssignment not found");
        }

        subAssignment.Name = updateSubAssignmentDto.Name;
        await _dataContext.SaveChangesAsync();
    }
}
