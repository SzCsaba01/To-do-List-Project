using ToDoList.Data.Entities;

namespace ToDoList.Data.Dto.AssignmentList;
public class CreateAssingmentListDto
{
    public Guid UserId { get; set; }
    public ListTypes ListType { get; set; }
    public string Name { get; set; }
}
