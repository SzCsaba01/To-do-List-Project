using ToDoList.Data.Dto.Assignment;
using ToDoList.Data.Entities;

namespace ToDoList.Data.Mappers;

public static class AssignmentMapping
{
    public static AssignmentDto ToAssignmentListDto(this Assignment assignment)
    {
        return new AssignmentDto
        {
            Name = assignment.Name,
            Status = assignment.Status,
            Deadline = assignment.Deadline,
        };
    }
}
