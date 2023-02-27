namespace ToDoList.Data.Entities;
public enum ListTypes{
    Private = 1,
    Shared,
    Administrative
}
public class ListType {
    public Guid Id { get; set; }
    public ListTypes Type { get; set; } 
    public ICollection<AssignmentList> AssignmentLists { get; set; }
}

