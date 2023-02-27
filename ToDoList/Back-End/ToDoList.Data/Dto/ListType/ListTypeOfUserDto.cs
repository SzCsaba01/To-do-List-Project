using ToDoList.Data.Entities;

namespace ToDoList.Data.Dto.ListType;

public class ListTypeOfUserDto
{
    public Guid UserId { get; set; }
    public ListTypes ListType { get; set; }
}
