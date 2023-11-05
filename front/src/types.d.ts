// WebGPU API를 위한 간단한 타입 정의
// interface GPU {
// 	requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter|null>;
// }

// // 기존 Navigator 인터페이스에 gpu 속성 추가
// interface Navigator {
// 	gpu: GPU;
// }
declare module '*.glsl' {
	const content: string;
	export default content;
}

interface canvasSize {
	width: number;
	height: number;
}