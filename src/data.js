// Static stand-in for the backend responses (userProfileState in the main app).
export const userProfile = {
	AccountSummary: {
		FirstName: 'Rahul Sharma',
		Email: 'rahul.sharma@example.com',
		CellPhone: '+91 98765 43210',
		isNumberVerified: true,
		Designation: 'Export Manager',
		CompanyName: 'Sample Exports Pvt Ltd',
		salesExecutive: 'Priya Verma',
		isCompanyAdmin: true
	},
	activeSubscriptionDetails: [
		{ PlanName: 'Free Trial', Validity: '2026-12-31T00:00:00Z', Status: 'Active' }
	],
	balance: {
		creditBalance: 450, maxCredits: 500,
		trendingCompanies: [18, 25], trendingProducts: [9, 10], profileViews: [40, 50],
		dailySearch: [12, 50], dailyRateLimit: [300, 1000], monthlyRateLimit: [4200, 10000]
	},
	teamActivities: {
		LoginCount: 128, SearchesCount: 342, ShipmentsUsed: 1250, NoOfWorkspaces: 14, DownloadCount: 27,
		TicketCount: 2, FavoriteShipmentCount: 36, CommentCount: 8, UserCreatedCount: 4, Rating: 5
	}
};
