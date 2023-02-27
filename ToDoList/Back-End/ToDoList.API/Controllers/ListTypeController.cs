using Microsoft.AspNetCore.Mvc;
using ToDoList.Services.Contracts;

namespace ToDoList.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ListTypeController : ControllerBase
{
    private readonly IListTypeService _listTypeService;
    public ListTypeController(IListTypeService listTypeService)
    {
        _listTypeService = listTypeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllListTypesAsync()
    {
        return Ok(await _listTypeService.GetAllListTypesAsync());
    }
}
