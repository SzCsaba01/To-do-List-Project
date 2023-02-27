using ToDoList.Data.Dto.AssignmentList;
using ToDoList.Data.Dto.AssignmentListUser;
using ToDoList.Data.Dto.ListType;

namespace ToDoList.Services.Contracts;
public interface IAssignmentListService{
    Task<IList<AssignmentListDto>> GetAllAssignmentListsAsync();
    Task<AssignmentListDto> GetAssignmentListByIdAsync(Guid id);
    Task DeleteAssignmentListAsync(Guid id);
    Task<string> UpdateAssignmentListAsync(UpdateAssignmentListDto assignmentListUpdated);
    Task<AssignmentListDto> CreateAssignmentListAsync(CreateAssingmentListDto newAssignmentList);
    Task<string> AddAssignmentListToUser(AssignmentListUserDto assignmentListUserDto);
    Task<IList<AssignmentListDto>> GetAllAssignmentListsByListTypeAsync(ListTypeOfUserDto listTypeOfUser);
    Task ConvertPrivateToSharedAssignmentList(Guid assignmentListId);
    Task<string> GetAssignmentListNameAsync(Guid assignmentListId);
}

