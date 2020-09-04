// Author: Mohamad Harits NF
// Title: Alternating Circles

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;
    
    uv *= 10.;
    
    
    // Alternating explanation
    float pass = floor(mod(u_time, 2.));
    uv.x += floor(mod(uv.y,2.)) * (pass * u_time);
    uv.y += (1. - floor(mod(uv.x,2.))) * ((1.-pass) * u_time);
    uv = fract(uv);
    
    float radius = .5;
    float thickness = 0.052;

    vec3 color = vec3(0.);
    float circ = circle(uv, radius);
    float circ2 = circle(uv, radius + thickness);
    float circ_result = (circ2 - circ);
    color = mix(vec3(0., 0., 0.), vec3(0.555,0.199,0.146), circ_result);

    gl_FragColor = vec4(color,1.0);
}