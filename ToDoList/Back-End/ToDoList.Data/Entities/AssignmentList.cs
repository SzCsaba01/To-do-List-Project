namespace ToDoList.Data.Entities;
public class AssignmentList {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public bool Status { get; set; }
    public ICollection<User> Users { get; set; }
    public ListType ListType { get; set; }
    public ICollection<Assignment> Assignments { get; set; }
}

