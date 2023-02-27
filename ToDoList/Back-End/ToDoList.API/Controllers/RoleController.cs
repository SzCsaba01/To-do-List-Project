using Microsoft.AspNetCore.Mvc;
using ToDoList.Data.Entities;
using ToDoList.Services.Contracts;

namespace ToDoList.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly IRoleService _roleService;
    public RoleController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet]
    public async Task<IList<Role>> GetAllRolesAsync()
    {
        return await _roleService.GetAllRolesAsync();
    }

    [HttpGet("{roleName}")]
    public async Task<Role> GetRoleByNameAsync(string roleName)
    {
        return await _roleService.GetRoleByNameAsync(roleName);
    }

}
