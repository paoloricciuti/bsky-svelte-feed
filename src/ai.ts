import { pipeline, env } from '@xenova/transformers';

env.localModelPath = './ai-model/';
env.allowRemoteModels = false;
env.backends.onnx.wasm.wasmPaths = './ai-model/';

class PipelineSingleton {
	static task = 'zero-shot-classification' as const;
	static model = 'Xenova/mobilebert-uncased-mnli' as const;
	static instance: ReturnType<typeof pipeline<typeof this.task>> | null = null;

	static async get(progress_callback?: Function) {
		if (this.instance === null) {
			this.instance = pipeline(this.task, this.model, { progress_callback });
		}
		return this.instance;
	}
}

export async function check(message: string) {
	const classifier = await PipelineSingleton.get();
	let want = 'web and software development';
	const labels_input = ['other', want];
	let res = await classifier(message, labels_input);
	let { scores, labels } = Array.isArray(res) ? res[0] : res;
	return scores[labels.findIndex((el) => el === want)]!;
}
