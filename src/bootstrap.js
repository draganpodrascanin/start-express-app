import path from 'path';
import fs from 'fs';
import ncp from 'ncp';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import chalk from 'chalk';

export class Bootstrap {
	access = promisify(fs.access);
	copy = promisify(ncp);
	options;

	constructor(options) {
		this.options = options;
	}

	getTemplateDir() {
		const currentFileUrl = import.meta.url;

		let template = this.options.language;

		//if database option add -database on template dir
		if (this.options.databaseInit && this.options.database)
			template += `-${this.options.database}`;
		if (
			this.options.databaseInit &&
			this.options.database &&
			this.options.authentication
		)
			template += '-auth';

		let templateDir = path.resolve(
			new URL(currentFileUrl).pathname,
			'../../templates',
			template.toLowerCase()
		);

		if (templateDir.startsWith('C:\\C:\\')) templateDir = templateDir.slice(3);
		return templateDir;
	}

	async copyTemplateFiles() {
		const templateDirectory = this.getTemplateDir();

		//if directory is specified and doesn't exist, make one.
		if (!fs.existsSync(templateDirectory)) {
			//create directory
			fs.mkdirSync(templateDirectory);
		}

		return this.copy(templateDirectory, this.options.targetDirectory, {
			clobber: false,
		});
	}

	async initGit() {
		const result = await execa('git', ['init'], {
			cwd: this.options.targetDirectory,
		});
		if (result.failed) {
			return Promise.reject(new Error('Failed to initialize git'));
		}
		return;
	}

	async installDependencies() {
		const result = await execa('npm', ['i'], {
			cwd: this.options.targetDirectory,
		});
		if (result.failed) {
			return Promise.reject(new Error('Failed to install packages'));
		}
		return;
	}

	async createProject() {
		const tasks = new Listr([
			{
				title: 'Copy project files',
				task: () => this.copyTemplateFiles(),
			},
			{
				title: 'Initialize git',
				task: () => this.initGit(),
				enabled: () => this.options.git,
			},
			{
				title: 'Install dependencies',
				task: () => this.installDependencies(),
				enabled: () => this.options.runInstall,
			},
		]);

		await tasks.run();
		console.log(`Project ready! ${chalk.green.bold('HAPPY CODING')}`);
		return true;
	}
}
