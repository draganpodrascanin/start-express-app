import { Options } from './options';
import { Bootstrap } from './bootstrap';

export const cli = async (rawArgs, yargs) => {
	const options = await new Options(rawArgs, yargs).getOptions();

	await new Bootstrap(options).createProject();
};
