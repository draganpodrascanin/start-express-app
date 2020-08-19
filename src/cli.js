import { Options } from './options';

export const cli = async (rawArgs, yargs) => {
	const options = await new Options(rawArgs, yargs).getOptions();

	console.log(options);
};
