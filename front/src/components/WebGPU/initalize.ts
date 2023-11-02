export const initWebGPU = async (canvas : HTMLCanvasElement) => {
    /* 브라우저에서 WebGPU를 사용할 수 있는지 확인 */
    if (!navigator.gpu) {
        console.warn('WebGPU not supported');
        return null;
    }
    /* adapter를 얻는 작업 */
	/* navigator.gpu.requestAdapter()이 promise를 return해서 await로 대기 */
	const adapter = await navigator.gpu.requestAdapter();
	if (!adapter) {
		throw new Error("No appropriate GPUAdapter found.");
	}
    
    /* device(추상화된 GPU 객체)를 얻음 */
	const device = await adapter.requestDevice();
	if (!device) {
		throw new Error("No appropriate GPUdevice found.");
	}
    
    return { gpuDevice: device , gpuAdapter: adapter};
};
