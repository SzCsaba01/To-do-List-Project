using ToDoList.Data.Dto.SubAssignment;

namespace ToDoList.Data.Dto.Assignment;

public class AssignmentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public DateTime Deadline { get; set; }
    public bool Status { get; set; }
    public DateTime Reminder { get; set; }
    public ICollection<SubAssignmentDto> subAssignmentDto {get; set;}

}
