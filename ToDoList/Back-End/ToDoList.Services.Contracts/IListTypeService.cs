using ToDoList.Data.Dto.ListType;

namespace ToDoList.Services.Contracts;

public interface IListTypeService
{
    Task<IEnumerable<ListTypeDto>> GetAllListTypesAsync();
}
