using ToDoList.Data.Dto.SubAssignment;

namespace ToDoList.Services.Contracts;
public interface ISubAssignmentService {
    Task<SubAssignmentDto> AddSubAssignmentAsync(AddSubAsignmentDto addSubAsignmentDto);
    Task DeleteSubAssignmentAsync(Guid Id);
    Task UpdateSubAssignmentAsync(UpdateSubAssignmentDto updateSubAssignmentDto);
    Task SwitchSubAssignmentStatusAsync(Guid Id);
    Task ChangeAllSubAssignmentStatusAsync(ChangeAllSubAssignmentStatusDto changeAllSubAssignmentStatusDto);
}
