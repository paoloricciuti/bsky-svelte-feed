import { registerHooks } from 'node:module';

registerHooks({
	resolve(specifier, context, next_resolve) {
		try {
			return next_resolve(specifier, context);
		} catch (error) {
			if (error?.code !== 'ERR_MODULE_NOT_FOUND' || !specifier.endsWith('.js')) {
				throw error;
			}

			return next_resolve(`${specifier.slice(0, -3)}.ts`, context);
		}
	}
});
