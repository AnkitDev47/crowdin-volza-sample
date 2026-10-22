import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userProfile } from '../data';

// Mirrors the "My Profile" tab of frontend.app.volza.com UserProfile; every visible string goes through t().
const BalanceBox = ({ icon, used, total, label, fmt }) => <div className="my-bal-box mar-2em">
	<span className={`${icon} icon-sprite`} />
	<div className="my-bal-box-title"><span>{fmt(used)}</span><span>/</span><span>{fmt(total)}</span></div>
	<div className="my-bal-box-sub-title">{label}</div>
</div>;
const ActivityBox = ({ icon, label, to }) => <div className="my-act-box">
	<span className={`${icon} icon-sprite mar-bott`} />
	<div className="my-act-box-title">{to ? <Link to={to}>{label}</Link> : label}</div>
</div>;
const Field = ({ icon, label, value, side }) => <div className={`col-md-6 user-profile-details ${side}`}>
	<div className="input-group">
		<input type="text" aria-label={label} value={value} disabled />
		<span className={`${icon} icon-sprite user-pro-img`} />
		<label>{label}</label>
	</div>
</div>;

export default function MyAccount() {
	const { t, i18n } = useTranslation();
	const lng = i18n.resolvedLanguage;
	const fmt = value => value.toLocaleString(lng);
	const { AccountSummary: user, activeSubscriptionDetails, balance: b, teamActivities: a } = userProfile;
	const act = (key, value) => t(`myAccount.activity.${key}`, { value: fmt(value) });
	return <div className="col-sm-12 col-md-12 col-lg-12 no-padding container user-profile">
		<div className="card table-card">
			<div className="row">
				<div className="col-md-12"><div className="data-heading">{t('myAccount.userInformation')}</div></div>
				<div className="col-md-12 mrtb-1 display-flex">
					<span className="remove-menu-bg profile-pic"><img src="/assets/img/user.png" alt={t('myAccount.profilePicture')} width="50" height="50" className="border-rad" /></span>
					<span className="user-pro-name-cont">
						<span className="user-pro-name">{user.FirstName}</span><br />
						<span className="user-pro-email">{user.Email}</span>
					</span>
				</div>
				<Field icon="bg-profile_user_name" label={t('myAccount.field.userName')} value={user.FirstName} side="pdr-2" />
				<div className="col-md-6 user-profile-details pdl-2">
					<div className="input-group">
						<input type="text" aria-label={t('myAccount.field.mobile')} value={user.CellPhone} disabled />
						<span className="bg-profile_pencil icon-sprite user-pro-img" />
						<label>{t('myAccount.field.mobile')}</label>
						{user.isNumberVerified && <div className="verifiedText"><i className="fa fa-check-circle verify-icon" aria-hidden="true" /> {t('myAccount.verified')}</div>}
					</div>
				</div>
				<Field icon="bg-profile_email" label={t('myAccount.field.email')} value={user.Email} side="pdr-2" />
				<Field icon="bg-profile_destination" label={t('myAccount.field.designation')} value={user.Designation} side="pdl-2" />
				<Field icon="bg-profile_company_name" label={t('myAccount.field.company')} value={user.CompanyName} side="pdr-2" />
				<Field icon="bg-profile_sales" label={t('myAccount.field.salesExecutive')} value={user.salesExecutive} side="pdl-2" />
				<Field icon="bg-profile_user_name" label={t('myAccount.field.userRole')} value={t(user.isCompanyAdmin ? 'myAccount.role.admin' : 'myAccount.role.nonAdmin')} side="pdr-2" />
			</div>
		</div>
		<div className="card table-card user-pro-my-bal">
			<div className="row"><div className="col-md-12"><div className="data-heading">{t('myAccount.myBalance')}</div></div></div>
			<div className="row">
				<div className="col-md-12 mrtb-1 margin-bottom-accounts">
					<div className="display-flex">
						<BalanceBox fmt={fmt} icon="bg-profile_search2" used={b.creditBalance} total={b.maxCredits} label={t('myAccount.balance.credit')} />
						<BalanceBox fmt={fmt} icon="bg-profile_company" used={b.trendingCompanies[0]} total={b.trendingCompanies[1]} label={t('myAccount.balance.trendingCompanies')} />
						<BalanceBox fmt={fmt} icon="bg-profile_Group1" used={b.trendingProducts[0]} total={b.trendingProducts[1]} label={t('myAccount.balance.trendingProducts')} />
						<BalanceBox fmt={fmt} icon="bg-profile_user" used={b.profileViews[0]} total={b.profileViews[1]} label={t('myAccount.balance.profileViews')} />
					</div>
				</div>
				<div className="col-md-12 mrtb-1 margin-bottom-accounts">
					<div className="display-flex">
						<BalanceBox fmt={fmt} icon="bg-profile_search2" used={b.dailySearch[0]} total={b.dailySearch[1]} label={t('myAccount.balance.dailySearch')} />
						<BalanceBox fmt={fmt} icon="bg-profile_search2" used={b.dailyRateLimit[0]} total={b.dailyRateLimit[1]} label={t('myAccount.balance.dailyRateLimit')} />
						<BalanceBox fmt={fmt} icon="bg-profile_search2" used={b.monthlyRateLimit[0]} total={b.monthlyRateLimit[1]} label={t('myAccount.balance.monthlyRateLimit')} />
					</div>
				</div>
			</div>
		</div>
		<div className="card table-card user-pro-my-act">
			<div className="col-md-12 pad-left-5"><div className="team-activities"><div className="data-heading">{t('myAccount.teamActivities')}</div></div></div>
			<div className="row">
				<div className="col-md-12 mrtb-1 margin-bottom-0">
					<div className="display-flex">
						<ActivityBox icon="bg-profile_Path" label={act('loginCount', a.LoginCount)} />
						<ActivityBox icon="bg-profile_search1" label={act('searches', a.SearchesCount)} />
						<ActivityBox icon="bg-profile_Group" label={act('pointsConsumed', a.ShipmentsUsed)} />
						<ActivityBox icon="bg-profile_workspace" label={act('workspace', a.NoOfWorkspaces)} />
						<ActivityBox icon="bg-profile_download" label={act('downloads', a.DownloadCount)} />
					</div>
					<div className="display-flex">
						<ActivityBox icon="bg-profile_tickets" label={act('tickets', a.TicketCount)} />
						<ActivityBox icon="bg-profile_favorite" label={act('favoriteShipments', a.FavoriteShipmentCount)} />
						<ActivityBox icon="bg-profile_comments" label={act('comments', a.CommentCount)} />
						<ActivityBox icon="bg-profile_man_user" label={act('usersCreated', a.UserCreatedCount)} />
						<ActivityBox icon="bg-profile_comments" label={act('rateUs', a.Rating)} />
					</div>
				</div>
			</div>
		</div>
		<div className="curr-sub">
			<table className="table table-striped shipmentTable">
				<thead><tr><th>{t('myAccount.subscription.current')}</th><th>{t('myAccount.subscription.endDate')}</th><th>{t('myAccount.subscription.status')}</th></tr></thead>
				<tbody>{activeSubscriptionDetails.map(s => <tr key={s.PlanName}>
					<td>{s.PlanName}</td><td>{new Date(s.Validity).toLocaleDateString(lng)}</td><td>{s.Status}</td>
				</tr>)}</tbody>
			</table>
		</div>
	</div>;
}
