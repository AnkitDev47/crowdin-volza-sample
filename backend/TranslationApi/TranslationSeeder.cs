using System.Data.SqlClient;
using System.Text.Json;

namespace TranslationApi
{
	public static class TranslationSeeder
	{
		const string CreateTableSql = @"
IF OBJECT_ID('dbo.IIPL_Translation') IS NULL
CREATE TABLE dbo.IIPL_Translation (
	LanguageCode     NVARCHAR(10)  NOT NULL,
	TranslationKey   NVARCHAR(400) NOT NULL,
	TranslationValue NVARCHAR(MAX) NOT NULL,
	CreatedOn        DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedOn       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
	CONSTRAINT PK_IIPL_Translation PRIMARY KEY (LanguageCode, TranslationKey)
);";

		// The file is the source of truth: new keys inserted, changed values updated, keys removed from the file deleted.
		// OPENJSON's [key] is BIN2, so it is cast to the DB collation to join with the table.
		// BIN2 collation on the value compare so case-only edits ("search" -> "Search") count as changes.
		const string MergeSql = @"
MERGE dbo.IIPL_Translation AS t
USING (SELECT [key] COLLATE DATABASE_DEFAULT AS TranslationKey, [value] AS TranslationValue FROM OPENJSON(@Json)) AS s
	ON t.LanguageCode = @LanguageCode AND t.TranslationKey = s.TranslationKey
WHEN MATCHED AND t.TranslationValue <> s.TranslationValue COLLATE Latin1_General_BIN2 THEN
	UPDATE SET TranslationValue = s.TranslationValue, ModifiedOn = SYSUTCDATETIME()
WHEN NOT MATCHED BY TARGET THEN
	INSERT (LanguageCode, TranslationKey, TranslationValue) VALUES (@LanguageCode, s.TranslationKey, s.TranslationValue)
WHEN NOT MATCHED BY SOURCE AND t.LanguageCode = @LanguageCode THEN
	DELETE
OUTPUT $action;";

		public static async Task SeedAsync(string connectionString, string localesDir)
		{
			// Every <code>.json in the folder is a language, so a new Crowdin language needs no code change.
			var files = Directory.GetFiles(localesDir, "*.json");
			if (files.Length == 0) throw new InvalidOperationException($"No locale files found in {Path.GetFullPath(localesDir)}");
			var locales = new Dictionary<string, string>();
			foreach (var file in files)
			{
				string json = await File.ReadAllTextAsync(file);
				Validate(json, file);
				locales[Path.GetFileNameWithoutExtension(file)] = json;
			}

			using var connection = new SqlConnection(connectionString);
			await connection.OpenAsync();
			using (var create = new SqlCommand(CreateTableSql, connection)) await create.ExecuteNonQueryAsync();

			// One transaction for all languages: a bad file rolls back everything instead of leaving a half-seeded DB.
			using var transaction = connection.BeginTransaction();
			foreach (var (languageCode, json) in locales)
			{
				using var merge = new SqlCommand(MergeSql, connection, transaction);
				merge.Parameters.AddWithValue("@LanguageCode", languageCode);
				merge.Parameters.AddWithValue("@Json", json);

				var counts = new Dictionary<string, int> { ["INSERT"] = 0, ["UPDATE"] = 0, ["DELETE"] = 0 };
				using (var reader = await merge.ExecuteReaderAsync())
					while (await reader.ReadAsync()) counts[reader.GetString(0)]++;

				Console.WriteLine($"{languageCode}: {counts["INSERT"]} inserted, {counts["UPDATE"]} updated, {counts["DELETE"]} deleted");
			}
			transaction.Commit();
		}

		// Guards the DELETE branch: an empty or malformed file must not wipe a language.
		static void Validate(string json, string file)
		{
			using var doc = JsonDocument.Parse(json);
			if (doc.RootElement.ValueKind != JsonValueKind.Object || !doc.RootElement.EnumerateObject().Any())
				throw new InvalidDataException($"{file}: expected a non-empty flat JSON object.");
			foreach (var prop in doc.RootElement.EnumerateObject())
				if (prop.Value.ValueKind != JsonValueKind.String)
					throw new InvalidDataException($"{file}: value of '{prop.Name}' is not a string (keys must be flat).");
		}
	}
}
