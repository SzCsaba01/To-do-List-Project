using System.Collections.ObjectModel;
using ToDoList.Data.Dto.AssignmentList;
using ToDoList.Data.Entities;

namespace ToDoList.Data.Mappers;

public static class AssignmentListMappings
{
    public static AssignmentListDto ToAssignmentListDto(this AssignmentList assignmentList)
    {
        return new AssignmentListDto
        {
            Id = assignmentList.Id,
            Name = assignmentList.Name,
            Status = assignmentList.Status
        };
    }

    public static AssignmentList ToAssignmentList(this CreateAssingmentListDto createAssingmentListDto, ListType listType) {
        return new AssignmentList {
            Name = createAssingmentListDto.Name,
            Status = false,
            ListType = listType,
            Assignments = new Collection<Assignment>(),
            Users = new Collection<User>()
        };
    }
}

