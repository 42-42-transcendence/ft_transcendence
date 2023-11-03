import vertexShaderCode from './Shaders/vertex.wgsl';
import fragmentShaderCode from './Shaders/fragment.wgsl';

export const webgpuStart = 
	async ( webGPU : webGPU, canvasSize: canvasSize ): Promise<void> => {

	try {
		// Create the vertex shader module
		const vertexShaderModule = webGPU.gpuDevice.createShaderModule({
			code: vertexShaderCode,
		});

		// Create the fragment shader module
		const fragmentShaderModule = webGPU.gpuDevice.createShaderModule({
			code: fragmentShaderCode,
		});

		const render = (): void => {
			if (!webGPU.gpuDevice) return;
		}

		requestAnimationFrame(render);
	} catch (e) {
		console.error("Error from webGPU:", e);
	}
}

export default webgpuStart;