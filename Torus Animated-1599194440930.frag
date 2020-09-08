// Author: Mohamad Harits NF
// Title: Torus Animated

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec2 center = vec2(.5);
    float smoothness = 0.890;
    smoothness /= 2.;
    float thickness = 0.172;
    float radius = 0.172;
    
    float disp = random(st + u_time);
    disp = (disp * 2. - 1.) * .6;
    // st += (disp);
    
    float animated_radius = clamp(abs(sin(radius + u_time * .5)), 0.01, 1.);
   
    float val1 = 1. - smoothstep(0. + smoothness, 1. - smoothness, length(st - center) * 1./(thickness + animated_radius));
    float val2 = 1. - smoothstep(0. + smoothness, 1. - smoothness, length(st - center) * 1./animated_radius);
    float final = val1 - val2;

    vec3 color = vec3(final);

    gl_FragColor = vec4(color,1.0);
}