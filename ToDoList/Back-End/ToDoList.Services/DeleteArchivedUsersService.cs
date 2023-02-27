using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ToDoList.Data;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class DeleteArchivedUsersService :BackgroundService {
    private readonly IServiceProvider _serviceProvider;

    public DeleteArchivedUsersService(IServiceProvider serviceProvider) {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        while (!stoppingToken.IsCancellationRequested) {
            using(var scope = _serviceProvider.CreateAsyncScope()) {
                var scopedService = scope.ServiceProvider.GetRequiredService<IUserService>();
                await scopedService.DeleteArchivedUsersAsync();
                await Task.Delay(TimeSpan.FromHours(Constants.DELETE_ARCHIVED_USERS_TIMER), stoppingToken);
            }
        }
    }
}
