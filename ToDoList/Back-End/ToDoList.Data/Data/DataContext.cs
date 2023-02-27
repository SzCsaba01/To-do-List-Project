using Microsoft.EntityFrameworkCore;
using ToDoList.Data.Entities;

namespace Data.Data;
public class DataContext : DbContext {
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<AssignmentList> AssignmentLists { get; set; }
    public DbSet<ListType> ListTypes { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<Reminder> Reminders { get; set; }
    public DbSet<SubAssignment> SubAssignments { get; set; }
}
