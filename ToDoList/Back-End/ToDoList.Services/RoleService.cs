using Data.Data;
using Microsoft.EntityFrameworkCore;
using ToDoList.API.Infrastructure;
using ToDoList.Data.Entities;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;

public class RoleService : IRoleService
{
    private readonly DataContext _dataContext;

    public RoleService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<IList<Role>> GetAllRolesAsync() {
        return await _dataContext.Roles.ToListAsync();
    }

    public async Task<Role> GetRoleByNameAsync(string roleName)
    {
        var role = await _dataContext.Roles.FirstOrDefaultAsync(h => h.Name.Equals(roleName));
        if (role is null)
        {
            throw new ModelNotFoundException("Role not found");
        }

        return role;
    }
}
