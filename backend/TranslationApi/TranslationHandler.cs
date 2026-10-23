using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace TranslationApi
{
	// Same shape as the main backend's handlers: controllers/<Name>.ashx?action=...
	[ApiController]
	public class TranslationHandler(IConfiguration configuration) : ControllerBase
	{
		[HttpGet("controllers/TranslationHandler.ashx")]
		public async Task<IActionResult> Index(string action, string? lang)
		{
			switch (action)
			{
				case "languages":
					return Ok(await Query("SELECT DISTINCT LanguageCode FROM dbo.IIPL_Translation ORDER BY LanguageCode", null,
						r => r.GetString(0)));
				case "get":
					if (string.IsNullOrEmpty(lang)) return BadRequest("lang is required");
					// Flat key -> value, the same shape as src/locales/<lang>.json, so i18next can load it directly.
					var rows = await Query("SELECT TranslationKey, TranslationValue FROM dbo.IIPL_Translation WHERE LanguageCode = @LanguageCode", lang,
						r => KeyValuePair.Create(r.GetString(0), r.GetString(1)));
					return rows.Count == 0 ? NotFound() : Ok(new Dictionary<string, string>(rows));
				default:
					return BadRequest("action must be 'languages' or 'get'");
			}
		}

		async Task<List<T>> Query<T>(string sql, string? languageCode, Func<SqlDataReader, T> map)
		{
			using var connection = new SqlConnection(configuration.GetConnectionString("CslaExConnection"));
			using var command = new SqlCommand(sql, connection);
			if (languageCode != null) command.Parameters.AddWithValue("@LanguageCode", languageCode);
			await connection.OpenAsync();
			using var reader = await command.ExecuteReaderAsync();
			var result = new List<T>();
			while (await reader.ReadAsync()) result.Add(map(reader));
			return result;
		}
	}
}
