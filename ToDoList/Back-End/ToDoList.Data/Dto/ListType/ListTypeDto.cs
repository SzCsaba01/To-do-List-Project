using ToDoList.Data.Entities;

namespace ToDoList.Data.Dto.ListType;

public class ListTypeDto
{
    public Guid Id { get; set; }
    public ListTypes Type { get; set; }
}
