import arg from 'arg';
import inquirer from 'inquirer';
import { Options } from './options';

// const parseArugmentsIntoOptions = (rawArg, yargs) => {
// 	const args = arg(
// 		{
// 			'--yes': Boolean,
// 			'--authentication': Boolean,
// 			'--git': Boolean,
// 			'--install': Boolean,
// 			'--typescript': Boolean,
// 			'--database': String,
// 			'--y': '--yes',
// 			'--db': '--database',
// 			'--auth': '--authentication',
// 			'--a': '--authentication',
// 			'--g': '--git',
// 			'--i': '--install',
// 			'--ts': '--typescript',
// 		},
// 		{
// 			argv: rawArg.slice(2),
// 		}
// 	);

// 	// if(yargs.language !== 'js' || yargs.language !== 'ts' || yargs.language !== 'javascript' || yargs.language !== 'typescript') yargs.language = undefined
// 	// if(yargs.language === 'js') yargs.language = 'javascript'
// 	// if(yargs.language === 'ts') yargs.language = 'typescript'

// 	if (yargs.database !== 'mongodb' || yargs.database !== 'sql')
// 		yargs.database = undefined;

// 	return {
// 		skipPrompt: args['--yes'] || false,
// 		git: args['--git'] || false,
// 		language: (args['--typescript'] && 'typescript') || false, //set typescript, or later prompted, or defaulted to javascript
// 		database: yargs.database || false,
// 		authentication: args['--authentication'] || false,
// 		runInstall: args['--install'] || false,
// 	};
// };

// const promptForMissingOptions = async (options) => {
// 	const DEFAULT_LANGUANGE = 'javascript';
// 	const DEFAULT_DATABASE = 'mongodb';

// 	if (options.skipPrompt) {
// 		return {
// 			...options,
// 			language: DEFAULT_LANGUANGE,
// 			database: DEFAULT_DATABASE,
// 		};
// 	}

// 	const questions = [];

// 	if (!options.language) {
// 		questions.push({
// 			type: 'list',
// 			name: 'language',
// 			message: 'Please choose language for your project.',
// 			choices: ['JavaScript', 'TypeScript'],
// 			default: DEFAULT_LANGUANGE,
// 		});
// 	}

// 	if (!options.database) {
// 		questions.push({
// 			type: 'list',
// 			name: 'database',
// 			message: 'Please choose database for your project.',
// 			choices: ['MongoDb', 'SQL (default to PostgreSQL)'],
// 			default: DEFAULT_DATABASE,
// 		});
// 	}

// 	if (!options.authentication) {
// 		questions.push({
// 			type: 'confirm',
// 			name: 'authentication',
// 			message: 'Do you want authentication setup?',
// 			default: false,
// 		});
// 	}

// 	if (!options.git) {
// 		questions.push({
// 			type: 'confirm',
// 			name: 'git',
// 			message: 'Initialize a git repository?',
// 			default: false,
// 		});
// 	}

// 	if (!options.runInstall) {
// 		questions.push({
// 			type: 'confirm',
// 			name: 'install',
// 			message: 'Install npm packages?',
// 			default: false,
// 		});
// 	}

// 	//return object with awnsers
// 	let awnsers = await inquirer.prompt(questions);

// 	//parse awnsers
// 	for (const key in awnsers) {
// 		if (awnsers.hasOwnProperty(key)) {
// 			if (typeof awnsers[key] === 'string')
// 				awnsers[key] = awnsers[key].split(' ')[0].toLowerCase();
// 		}
// 	}

// 	return {
// 		...options,
// 		language: options.language || awnsers.language,
// 		database: options.database || awnsers.database,
// 		authentication: options.authentication || awnsers.authentication,
// 		git: options.git || awnsers.git,
// 		runInstall: options.install || awnsers.install,
// 	};
// };

export const cli = async (rawArgs, yargs) => {
	const options = await new Options(rawArgs, yargs).getOptions();

	console.log(options);
};
