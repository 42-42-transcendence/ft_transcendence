[[group(0), binding(0)]]
var<uniform> inputColor: vec4<f32>;

struct FragmentOutput {
    [[location(0)]] color: vec4<f32>;
};

/* main 함수 정의 */
[[stage(fragment)]]
fn main() -> FragmentOutput {
	
	/* fragment output position */
	var output: FragmentOutput;
	output.color = inputColor;
	return output;
}
