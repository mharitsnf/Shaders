// Author: Mohamad Harits NF
// Title: Breathing Circle

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    vec2 center = vec2(.5);
    float radius = 0.008;
    float smoothness = 0.5;
    
    float animated_radius = clamp(abs(sin(radius + u_time * .5)), 0., 1.);
    
    float distance = 1. - smoothstep(0. + smoothness, 1. - smoothness, length(st - center) * 1./animated_radius) ;

    vec3 color = vec3(distance);

    gl_FragColor = vec4(color,1.0);
}