import inputsPlugin from '@ocm/inputs';
import mysqlPlugin from '@ocm/mysql';
import userPlugin from '@ocm/user';

import inputTypes from './inputs';
import routes from './routes';

export default class Omni {
	plugins = [
		mysqlPlugin,
		userPlugin,
		inputsPlugin,
	];

	constructor() {
		this.epics = [];
		this.reducers = {};
		this.routes = [...routes];

		this.pluginApi = {
			inputTypes,
			addRoute: this.addRoute,
			epics: this.epics,
			reducers: this.reducers,
		};
	}

	addRoute = route => {
		this.routes[0].childRoutes.push(route);
	}

	initPlugins() {
		return new Promise(resolve => {
			const plugins = [...this.plugins];

			const next = () => {
				const plugin = plugins.shift();
				if (!plugin) return resolve();

				if (plugin.length === 1) {
					plugin(this.pluginApi);
					next();
				} else {
					plugin(this.pluginApi, next);
				}
			};

			next();
		});
	}

	use(plugin) {
		if (typeof plugin !== 'function') {
			throw new Error('Omni plugins need to be functions');
		}

		this.plugins.push(plugin);
	}
}
