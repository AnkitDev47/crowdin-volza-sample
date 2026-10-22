import React from 'react';
import { Link } from 'react-router-dom';
import { userProfile } from '../data';

// Mirrors the "My Profile" tab of frontend.app.volza.com UserProfile.
// ponytail: English only for now — wrap strings in t() when this page joins the Crowdin rollout.
const fmt = value => value.toLocaleString('en-US');
const BalanceBox = ({ icon, used, total, label }) => <div className="my-bal-box mar-2em">
	<span className={`${icon} icon-sprite`} />
	<div className="my-bal-box-title"><span>{fmt(used)}</span><span>/</span><span>{fmt(total)}</span></div>
	<div className="my-bal-box-sub-title">{label}</div>
</div>;
const ActivityBox = ({ icon, value, label, to }) => <div className="my-act-box">
	<span className={`${icon} icon-sprite mar-bott`} />
	<div className="my-act-box-title">{to ? <Link to={to}>{fmt(value)} {label}</Link> : <>{fmt(value)} {label}</>}</div>
</div>;
const Field = ({ icon, label, value, side }) => <div className={`col-md-6 user-profile-details ${side}`}>
	<div className="input-group">
		<input type="text" aria-label={label} value={value} disabled />
		<span className={`${icon} icon-sprite user-pro-img`} />
		<label>{label}</label>
	</div>
</div>;

export default function MyAccount() {
	const { AccountSummary: user, activeSubscriptionDetails, balance: b, teamActivities: a } = userProfile;
	return <div className="col-sm-12 col-md-12 col-lg-12 no-padding container user-profile">
		<div className="card table-card">
			<div className="row">
				<div className="col-md-12"><div className="data-heading">User Information</div></div>
				<div className="col-md-12 mrtb-1 display-flex">
					<span className="remove-menu-bg profile-pic"><img src="/assets/img/user.png" alt="Profile picture" width="50" height="50" className="border-rad" /></span>
					<span className="user-pro-name-cont">
						<span className="user-pro-name">{user.FirstName}</span><br />
						<span className="user-pro-email">{user.Email}</span>
					</span>
				</div>
				<Field icon="bg-profile_user_name" label="User Name" value={user.FirstName} side="pdr-2" />
				<div className="col-md-6 user-profile-details pdl-2">
					<div className="input-group">
						<input type="text" aria-label="Mobile" value={user.CellPhone} disabled />
						<span className="bg-profile_pencil icon-sprite user-pro-img" />
						<label>Mobile</label>
						{user.isNumberVerified && <div className="verifiedText"><i className="fa fa-check-circle verify-icon" aria-hidden="true" /> Verified</div>}
					</div>
				</div>
				<Field icon="bg-profile_email" label="Email" value={user.Email} side="pdr-2" />
				<Field icon="bg-profile_destination" label="Designation" value={user.Designation} side="pdl-2" />
				<Field icon="bg-profile_company_name" label="Company" value={user.CompanyName} side="pdr-2" />
				<Field icon="bg-profile_sales" label="Sales Executive" value={user.salesExecutive} side="pdl-2" />
				<Field icon="bg-profile_user_name" label="User Role" value={user.isCompanyAdmin ? 'Admin' : 'Non Admin'} side="pdr-2" />
			</div>
		</div>
		<div className="card table-card user-pro-my-bal">
			<div className="row"><div className="col-md-12"><div className="data-heading">My Balance</div></div></div>
			<div className="row">
				<div className="col-md-12 mrtb-1 margin-bottom-accounts">
					<div className="display-flex">
						<BalanceBox icon="bg-profile_search2" used={b.creditBalance} total={b.maxCredits} label="Credit Balance" />
						<BalanceBox icon="bg-profile_company" used={b.trendingCompanies[0]} total={b.trendingCompanies[1]} label="Searches left in Trending Companies" />
						<BalanceBox icon="bg-profile_Group1" used={b.trendingProducts[0]} total={b.trendingProducts[1]} label="Searches Left in Trending Products" />
						<BalanceBox icon="bg-profile_user" used={b.profileViews[0]} total={b.profileViews[1]} label="Profile View Balance" />
					</div>
				</div>
				<div className="col-md-12 mrtb-1 margin-bottom-accounts">
					<div className="display-flex">
						<BalanceBox icon="bg-profile_search2" used={b.dailySearch[0]} total={b.dailySearch[1]} label="Daily Search" />
						<BalanceBox icon="bg-profile_search2" used={b.dailyRateLimit[0]} total={b.dailyRateLimit[1]} label="Daily Rate Limit" />
						<BalanceBox icon="bg-profile_search2" used={b.monthlyRateLimit[0]} total={b.monthlyRateLimit[1]} label="Monthly Rate Limits" />
					</div>
				</div>
			</div>
		</div>
		<div className="card table-card user-pro-my-act">
			<div className="col-md-12 pad-left-5"><div className="team-activities"><div className="data-heading">Team Activities</div></div></div>
			<div className="row">
				<div className="col-md-12 mrtb-1 margin-bottom-0">
					<div className="display-flex">
						<ActivityBox icon="bg-profile_Path" value={a.LoginCount} label="Login count till date" />
						<ActivityBox icon="bg-profile_search1" value={a.SearchesCount} label="Searches in last 30 days" />
						<ActivityBox icon="bg-profile_Group" value={a.ShipmentsUsed} label="Points consumed" />
						<ActivityBox icon="bg-profile_workspace" value={a.NoOfWorkspaces} label="Workspace" />
						<ActivityBox icon="bg-profile_download" value={a.DownloadCount} label="Downloads" />
					</div>
					<div className="display-flex">
						<ActivityBox icon="bg-profile_tickets" value={a.TicketCount} label="Trouble Tickets" />
						<ActivityBox icon="bg-profile_favorite" value={a.FavoriteShipmentCount} label="Favorites Shipments" />
						<ActivityBox icon="bg-profile_comments" value={a.CommentCount} label="Comments" />
						<ActivityBox icon="bg-profile_man_user" value={a.UserCreatedCount} label="Users Created" />
						<ActivityBox icon="bg-profile_comments" value={a.Rating} label="Rate Us!" />
					</div>
				</div>
			</div>
		</div>
		<div className="curr-sub">
			<table className="table table-striped shipmentTable">
				<thead><tr><th>Current Subscriptions</th><th>End Date</th><th>Status</th></tr></thead>
				<tbody>{activeSubscriptionDetails.map(s => <tr key={s.PlanName}>
					<td>{s.PlanName}</td><td>{new Date(s.Validity).toLocaleDateString('en-US')}</td><td>{s.Status}</td>
				</tr>)}</tbody>
			</table>
		</div>
	</div>;
}
