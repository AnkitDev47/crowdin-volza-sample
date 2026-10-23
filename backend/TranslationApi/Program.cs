var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("CslaExConnection")
	?? throw new InvalidOperationException("ConnectionStrings:CslaExConnection is not configured.");

// `dotnet run -- seed <localesDir>`: upsert every <code>.json into the DB and exit (used by CI).
if (args.Length > 0 && args[0] == "seed")
{
	await TranslationApi.TranslationSeeder.SeedAsync(connectionString, args.Length > 1 ? args[1] : "../../src/locales");
	return;
}

builder.Services.AddControllers();
var app = builder.Build();
app.MapControllers();
app.Run();
