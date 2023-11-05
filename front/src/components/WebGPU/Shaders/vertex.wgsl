/* input struct 정의 */
struct VertexInput {
	[[location(0)]] position: vec2<f32>;
};

/* output struct 정의 */
struct VertexOutput {
	[[builtin(position)]] position: vec4<f32>;
};

/* main 함수 정의 */
[[stage(vertex)]]
fn main(input: VertexInput) -> VertexOutput {
	
	
	/* set output position */
	var output: VertexOutput;
	output.position = vec4<f32>(input.position, 0.0, 1.0);
	
	return output;
}
