namespace ToDoList.Data.Entities;
public class SubAssignment {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public bool Status { get; set; }
    public Assignment Assignment { get; set; }
}
