var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseStaticFiles();

app.MapGet("/", context => {
    context.Response.Redirect("../HTML/Produtcs.html");
    return Task.CompletedTask;
});

app.Run();
