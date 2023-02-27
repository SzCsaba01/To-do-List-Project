namespace ToDoList.Data.Dto.User;
public class GetUserResetPasswordDto {
    public Guid Id { get; set; }
    public DateTime TokenGenerationTime { get; set; }
}
