using ToDoList.Data.Entities;

namespace ToDoList.Services.Contracts;
public interface IRoleService
{
    Task<IList<Role>> GetAllRolesAsync();
    Task<Role> GetRoleByNameAsync(string name);
}
