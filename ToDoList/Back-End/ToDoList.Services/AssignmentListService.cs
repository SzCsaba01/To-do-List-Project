using Data.Data;
using Microsoft.EntityFrameworkCore;
using ToDoList.API.Infrastructure;
using ToDoList.Data.Dto.AssignmentList;
using ToDoList.Data.Dto.AssignmentListUser;
using ToDoList.Data.Dto.ListType;
using ToDoList.Data.Entities;
using ToDoList.Data.Mappers;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class AssignmentListService : IAssignmentListService 
{
    private readonly DataContext _dataContext;
    private readonly IUserService _userServices;

    public AssignmentListService(DataContext dataContext, IUserService userServices)
    {
        _dataContext = dataContext;
        _userServices = userServices;
    }

    public async Task<IList<AssignmentListDto>> GetAllAssignmentListsAsync()
    {
        return await _dataContext.AssignmentLists
            .Include(x => x.ListType)
            .Select(x => x.ToAssignmentListDto())
            .ToListAsync();
    }

    public async Task<IList<AssignmentListDto>> GetAllAssignmentListsByListTypeAsync(ListTypeOfUserDto listTypeOfUser)
    {
        var listType = await _dataContext.ListTypes
            .FirstOrDefaultAsync(l => l.Type.Equals(listTypeOfUser.ListType));

        if (listType is null)
        {
            throw new ModelNotFoundException("List Type not found");
        }

        var userId = await _dataContext.Users
            .Where(u => u.Id.Equals(listTypeOfUser.UserId))
            .Select(u => u.Id)
            .FirstOrDefaultAsync();

        if (userId == Guid.Empty)
        {
            throw new ModelNotFoundException("User not found");
        }

        var assignmentLists = await _dataContext.AssignmentLists
            .Include(x => x.ListType)
            .Include(x => x.Users)
            .Where(x => x.ListType.Id.Equals(listType.Id) && x.Users.Select(u => u.Id).Contains(userId))
            .Select(al => new AssignmentListDto
            {
                Id = al.Id,
                Name = al.Name,
                Status = al.Status
            })
            .ToListAsync();

        return assignmentLists;
    }

    public async Task<AssignmentListDto> GetAssignmentListByIdAsync(Guid Id)
    {
        var assignmentList = await _dataContext.AssignmentLists
            .Where(a => a.Id.Equals(Id))
            .Include(x => x.ListType)
            .Select(x => x.ToAssignmentListDto())
            .FirstOrDefaultAsync();
        if(assignmentList is null)
        {
            throw new ModelNotFoundException("Assignment List not found");
        }

        return assignmentList;

    }

    public async Task DeleteAssignmentListAsync(Guid id)
    { 
        var assignmentList = await _dataContext.AssignmentLists.FirstOrDefaultAsync(ass => ass.Id == id);

        if (assignmentList is null)
        {
            throw new ModelNotFoundException("The assignment does not exist.");
        }

        _dataContext.Remove(assignmentList);
        await _dataContext.SaveChangesAsync();
    }

    
    public async Task<string> UpdateAssignmentListAsync(UpdateAssignmentListDto assignmentListUpdated)
    {
        var assignmentList = await _dataContext.AssignmentLists
            .Include(a => a.ListType)
            .FirstOrDefaultAsync(a => a.Id == assignmentListUpdated.Id);
        if(assignmentList is null)
        {
            throw new ModelNotFoundException("Assignment List model not found");
        }
              
        assignmentList.Name = assignmentListUpdated.Name;

        _dataContext.AssignmentLists.Update(assignmentList);
        await _dataContext.SaveChangesAsync();

        return assignmentList.Name;
    }

    public async Task ConvertPrivateToSharedAssignmentList(Guid assignmentListId)
    {
        var listType = await _dataContext.ListTypes
            .FirstOrDefaultAsync(l => l.Type.Equals((ListTypes)2));

        var assignmentList = await _dataContext.AssignmentLists
            .Include(a => a.ListType)
            .FirstOrDefaultAsync(a => a.Id == assignmentListId);

        if (assignmentList is null)
        {
            throw new ModelNotFoundException("Assignment List model not found");
        }

        assignmentList.ListType = listType;

        _dataContext.AssignmentLists.Update(assignmentList);

        await _dataContext.SaveChangesAsync();
    }

    public async Task<AssignmentListDto> CreateAssignmentListAsync(CreateAssingmentListDto createAssingmentListDto)
    {
        var listType = await _dataContext.ListTypes
            .FirstOrDefaultAsync(l => l.Type.Equals(createAssingmentListDto.ListType));

        if(listType is null )
        {
            throw new ModelNotFoundException("List Type not found");
        }

        User user;

        try {
            user = await _userServices.GetUserByIdAsync(createAssingmentListDto.UserId);
        }catch(Exception ex) {
            throw new ModelNotFoundException(ex.Message);
        }

        var newAssignmentListToCreate = AssignmentListMappings.ToAssignmentList(createAssingmentListDto, listType);

        newAssignmentListToCreate.Users.Add(user);
        await _dataContext.AssignmentLists.AddAsync(newAssignmentListToCreate);
        user.AssignmentLists.Add(newAssignmentListToCreate);
        await _dataContext.SaveChangesAsync();

        return new AssignmentListDto
        {
            Id = newAssignmentListToCreate.Id,
            Status = newAssignmentListToCreate.Status,
            Name = newAssignmentListToCreate.Name
        };
    }
    
    public async Task<string> AddAssignmentListToUser(AssignmentListUserDto assignmentListUserDto)
    {
        var user = await _dataContext.Users
            .Where(a => a.Email == assignmentListUserDto.Email)
            .Include(x => x.AssignmentLists)
            .FirstOrDefaultAsync();

        if (user is null)
        {
            throw new ModelNotFoundException("The user can't be found");
        }

        var assignmentList = await _dataContext.AssignmentLists
            .Where(a => a.Id.Equals(assignmentListUserDto.AssignmentListId))
            .FirstOrDefaultAsync();

        if (assignmentList is null)
        {
            throw new ModelNotFoundException("The list doesn't exist");
        }
        
        user.AssignmentLists.Add(assignmentList);
        _dataContext.Users.Update(user);
        
        await _dataContext.SaveChangesAsync();

        return user.UserName;
    }

    public async Task<string> GetAssignmentListNameAsync(Guid assignmentListId)
    {
        var assignmentListName = await _dataContext.AssignmentLists
            .Where(al => al.Id == assignmentListId)
            .Select(al => al.Name)
            .FirstOrDefaultAsync();

        if(assignmentListName == String.Empty)
        {
            throw new ModelNotFoundException("Assignment List don't found");
        }

        return assignmentListName;
    }
}