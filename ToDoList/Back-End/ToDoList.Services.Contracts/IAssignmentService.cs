using ToDoList.Data.Dto.Assignment;
using ToDoList.Data.Entities;

namespace ToDoList.Services.Contracts;
public interface IAssignmentService{
    Task<IEnumerable<AssignmentDto>> GetAllAssignmentsAsync();
    Task<AssignmentDto> DeleteAssignmentAsync(Guid id);
    Task<AssignmentDto> CreateAssignmentAsync(CreateAssignmentDto createAssignment);
    Task<AssignmentDto> UpdateAssignmentAsync(UpdateAssignmentDto assignmentToUpdate);
    Task<Assignment> GetAssignmentByIdAsync(Guid Id);
    Task<IList<AssignmentDto>> GetUserAssignmentsFromAssignmentListIdAsync(UserAssignmentsFromList userAssignmentsFromList);
    Task<bool> UpdateAssignmentStatusAsync(Guid id);
    Task<IList<AssignmentForExcelDto>> GetUserAssignmentsForExcelAsync(UserAssignmentsFromList userAssignmentsFromList);
    Task<int> GetNumberOfAssignmentsByAssignmentTypeForUserAsync(NumberOfAssignmentsDto numberOfAssignmentsDto);
    Task<int> GetNumberOfCompletedAssignmentsTodayByAssignmentTypeForUserAsync(NumberOfAssignmentsDto numberOfAssignmentsDto);
    Task<IList<AssignmentDto>> OrderAssignmnetsByDeadlineAndStatusAsync(UserAssignmentsFromList userAssignmentsFromList);
}
