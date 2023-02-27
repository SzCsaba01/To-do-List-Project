using ToDoList.Data.Entities;

namespace ToDoList.Data.Dto.Assignment;

public class NumberOfAssignmentsDto
{
    public Guid UserId { get; set; }
    public ListTypes ListType { get; set; }
}
