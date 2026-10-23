import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { i18nReady } from './i18n';
import LanguageSelector from './LanguageSelector';
import Welcome from './pages/Welcome';
import MyAccount from './pages/MyAccount';

// Same stylesheets as frontend.app.volza.com/App/src/index.jsx, copied unchanged.
import './index.css';
import './css/index.css';
import './css/search.css';
import './css/sprite/sprite.css';
import './css/sprite/css_Sprites.css';
import './css/mobile/Home.css';
import './css/mobile/MyProfile.css';
import './app.css';

// Render after the first language arrives from the API, so the page never flashes raw keys.
i18nReady.finally(() => ReactDOM.render(
	<BrowserRouter>
		<header className="sample-header">
			<img src="/assets/img/logo-blue.png" alt="Volza" height="32" />
			<nav>
				<NavLink to="/home">Home</NavLink>
				<NavLink to="/myprofile">My Account</NavLink>
			</nav>
			<LanguageSelector />
		</header>
		<main className="sample-main">
			<Switch>
				<Route path="/home" component={Welcome} />
				<Route path="/myprofile" component={MyAccount} />
				<Redirect to="/home" />
			</Switch>
		</main>
	</BrowserRouter>,
	document.getElementById('root')
));
