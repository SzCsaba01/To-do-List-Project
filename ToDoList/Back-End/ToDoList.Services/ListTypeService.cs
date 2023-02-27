using Data.Data;
using Microsoft.EntityFrameworkCore;
using ToDoList.Data.Dto.ListType;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;

public class ListTypeService : IListTypeService
{
    private readonly DataContext _dataContext;
    public ListTypeService(DataContext context)
    {
        _dataContext = context;
    }

    public async Task<IEnumerable<ListTypeDto>> GetAllListTypesAsync()
    {
        return await _dataContext.ListTypes
            .Select(l => new ListTypeDto
            {
                Id = l.Id,
                Type = l.Type
            }
            ).ToListAsync();
    }
}
