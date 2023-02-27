using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ToDoList.Data;
using ToDoList.Services.Contracts;

namespace ToDoList.Services.Business;
public class SchedulerService : BackgroundService {

    private readonly IServiceProvider _serviceProvider;

    public SchedulerService(IServiceProvider serviceProvider) {
        
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {

        while(!stoppingToken.IsCancellationRequested) {

            using(var scope = _serviceProvider.CreateAsyncScope()){

                var scopedService = scope.ServiceProvider.GetRequiredService<IReminderService>();
                await scopedService.VerifyReminderAsync();
                await Task.Delay(TimeSpan.FromMinutes(Constants.SCHEDULER_TIMER), stoppingToken);
            }
        }
    }
}
