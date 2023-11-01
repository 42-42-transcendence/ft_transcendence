export const initWebGPU = async (canvas) => {
    // WebGPU 지원 여부 확인
    if (!navigator.gpu) {
        console.warn('WebGPU not supported');
        return;
    }
};
