import arg from 'arg';
import inquirer from 'inquirer';

export class Options {
	rawArgs;
	yargs;

	constructor(rawArgs, yargs) {
		this.rawArgs = rawArgs;
		this.yargs = yargs;
	}

	parseArugmentsIntoOptions() {
		const args = arg(
			{
				'--yes': Boolean,
				'--authentication': Boolean,
				'--git': Boolean,
				'--install': Boolean,
				'--typescript': Boolean,
				'--databaseInit': Boolean,
				'--database': String,
				'--y': '--yes',
				'--db': '--database',
				'--dbInit': '--databaseInit',
				'--database-init': '--database-init',
				'--db-init': '--databaseInit',
				'--auth': '--authentication',
				'--a': '--authentication',
				'--g': '--git',
				'--i': '--install',
				'--ts': '--typescript',
			},
			{
				permissive: true,
				argv: this.rawArgs.slice(2),
			}
		);

		//must be mongodb or sql if u set db in advance
		if (this.yargs.database !== 'mongodb' && this.yargs.database !== 'sql')
			this.yargs.database = undefined;

		//setting up target directory path
		let targetDirectoryName = this.yargs._[0];
		if (targetDirectoryName === '.') targetDirectoryName = undefined;

		const targetDirectory = targetDirectoryName
			? `${process.cwd()}/${targetDirectoryName}`
			: process.cwd();

		return {
			skipPrompt: args['--yes'] || false,
			git: args['--git'] || false,
			language: (args['--typescript'] && 'typescript') || false, //set typescript, or later prompted, or defaulted to javascript
			databaseInit: args['--databaseInit'] || false,
			database: this.yargs.database || false,
			authentication: args['--authentication'] || false,
			runInstall: args['--install'] || false,
			targetDirectoryName,
			targetDirectory,
		};
	}

	async promptForMissingOptions(options) {
		const DEFAULT_LANGUANGE = 'javascript';
		const DEFAULT_DATABASE = 'mongodb';

		if (options.skipPrompt) {
			return {
				...options,
				language: DEFAULT_LANGUANGE,
				database: DEFAULT_DATABASE,
			};
		}

		if (options.database) options.databaseInit = true;

		const setupQuestions = [];

		if (!options.databaseInit) {
			setupQuestions.push({
				type: 'confirm',
				name: 'databaseInit',
				message: 'Do you want database in your project?',
				default: false,
			});
		}

		let setupAwnser;

		//if it isn't specified ask for setup questions
		if (setupQuestions.length > 0)
			setupAwnser = await inquirer.prompt(setupQuestions);
		const questions = [];

		if (!options.language) {
			questions.push({
				type: 'list',
				name: 'language',
				message: 'Please choose language for your project.',
				choices: ['JavaScript', 'TypeScript'],
				default: DEFAULT_LANGUANGE,
			});
		}

		if (
			(options.databaseInit || (setupAwnser && setupAwnser.databaseInit)) &&
			!options.database
		) {
			questions.push({
				type: 'list',
				name: 'database',
				message: 'Please choose database for your project.',
				choices: ['MongoDb', 'SQL (default to mysql)'],
				default: DEFAULT_DATABASE,
			});
		}

		if (
			(options.databaseInit || (setupAwnser && setupAwnser.databaseInit)) &&
			!options.authentication
		) {
			questions.push({
				type: 'confirm',
				name: 'authentication',
				message: 'Do you want authentication setup?',
				default: false,
			});
		}

		if (!options.git) {
			questions.push({
				type: 'confirm',
				name: 'git',
				message: 'Initialize a git repository?',
				default: false,
			});
		}

		if (!options.runInstall) {
			questions.push({
				type: 'confirm',
				name: 'install',
				message: 'Install npm packages?',
				default: false,
			});
		}

		//return object with awnsers
		let awnsers = await inquirer.prompt(questions);

		//parse awnsers
		for (const key in awnsers) {
			if (awnsers.hasOwnProperty(key)) {
				if (typeof awnsers[key] === 'string')
					awnsers[key] = awnsers[key].split(' ')[0].toLowerCase();
			}
		}

		return {
			...options,
			language: options.language || awnsers.language,
			database: options.database || awnsers.database,
			databaseInit: options.databaseInit || setupAwnser.databaseInit,
			authentication: awnsers.authentication || options.authentication,
			git: options.git || awnsers.git,
			runInstall: options.install || awnsers.install,
		};
	}

	async getOptions() {
		let options = this.parseArugmentsIntoOptions();

		try {
			options = await this.promptForMissingOptions(options);
		} catch (err) {
			console.error(err);
		}
		return options;
	}
}
