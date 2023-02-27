using ToDoList.Data.Dto.SubAssignment;
using ToDoList.Data.Entities;

namespace ToDoList.Data.Mappers;
public static class SubAssignmentMapping {
    public static SubAssignment ToSubAssignment(this AddSubAsignmentDto addSubAsignmentDto) {
        return new SubAssignment {
            Name = addSubAsignmentDto.Name,
            Status = false,
        };
    }
}
