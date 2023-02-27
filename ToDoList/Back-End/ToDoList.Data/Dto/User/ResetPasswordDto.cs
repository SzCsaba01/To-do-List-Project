namespace ToDoList.Data.Dto.User;
public class ResetPasswordDto {
    public Guid Id { get; set; }
    public string NewPassword{get; set; }
    public string RepeatNewPassword { get; set; }
}
