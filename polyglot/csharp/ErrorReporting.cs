using DemoShop.Models;
using Sentry;

namespace DemoShop.Services;

public static class ErrorReporting
{
    // Attach the signed-in user to Sentry events.
    public static void SetUser(User user)
    {
        SentrySdk.ConfigureScope(scope =>
        {
            scope.User = new SentryUser
            {
                Id = user.Id.ToString(),
            };
        });
    }
}
