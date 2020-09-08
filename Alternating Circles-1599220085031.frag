// Author: Mohamad Harits NF
// Title: Alternating Circles

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


// Taken from The Book of Shaders
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
    
    // Pass variable is for determining whether the u_time is even or odd (expression will return 1 if even).
    // The floor(mod(uv.y,2.)) expression will return the odd rows. Inverting the result by subtracting 1. with
    // the value will return even rows. If you want column, use uv.x instead, and change uv.x to uv.y on the left
    // hand side.

    // What line 32 and 33 does is basically checking if the pass is 1 then move the uv by u_time.
    float pass = floor(mod(u_time, 2.));
    uv.x += floor(mod(uv.y,2.)) * (pass * u_time);
    uv.y += (1. - floor(mod(uv.x,2.))) * ((1.-pass) * u_time);

    // Fract will return the fraction value, i.e. fract(1.234) will return .234
    uv = fract(uv);
    
    float radius = .5;
    float thickness = 0.2;

    vec3 color = vec3(0.);
    float circ = circle(uv, radius);
    float circ2 = circle(uv, radius + thickness);
    float circ_result = (circ2 - circ);
    color = mix(vec3(0., 0., 0.), vec3(0.555,0.199,0.146), circ_result);

    gl_FragColor = vec4(color,1.0);
}