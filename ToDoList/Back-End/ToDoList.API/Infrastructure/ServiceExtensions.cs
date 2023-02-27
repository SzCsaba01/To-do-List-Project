using ToDoList.Services.Business;
using ToDoList.Services.Contracts;

namespace ToDoList.API.Infrastructure
{
    public static class ServiceExtensions
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {

            services.AddHostedService<SchedulerService>();
            services.AddHostedService<DeleteArchivedUsersService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IAssignmentListService, AssignmentListService>();
 			services.AddScoped<IAssignmentService, AssignmentService>();
			services.AddScoped<IListTypeService, ListTypeService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IEncryptionService, EncryptionService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();
			services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IReminderService, ReminderService>();
            services.AddScoped<ISubAssignmentService, SubAssignmentService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<ITokenService, TokenService>();
            return services;
        }
    }
}
