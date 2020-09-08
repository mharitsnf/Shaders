// Author: Mohamad Harits NF
// Title: FBM (Watercolor practice)

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 5
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 4.000;
        amplitude *= 0.204;
    }
    return value;
}

vec3 col255to1(vec3 col) {
    return col/255.;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st *= 8.;
    float t = u_time * .2; 

    vec2 w = vec2(0.);
    w.x = fbm(st + vec2(.3, .1) + t * .2);
    w.y = fbm(st + vec2(.4, .8) + t * .1);
    
    vec2 e = vec2(0.);
    e.x = fbm(st + 4.*w + vec2(.47812, .74823) + t * .08);
    e.y = fbm(st + 4.*w + vec2(0.340,0.210) + t * .062);
    
    float q = fbm(st + 2.*e);
    
    vec3 blue1 = col255to1(vec3(55, 125, 179));
    vec3 blue2 = col255to1(vec3(21, 42, 99));
    vec3 green1 = col255to1(vec3(59, 191, 187));
    vec3 db1 = col255to1(vec3(14, 6, 41));
    
    vec3 color = mix(blue2, blue1, clamp((q * q * q * 4.), 0., 1.));
    color = mix(color, green1, clamp((q * q * 4.), 0., 1.));
    color = mix(db1, color, clamp((q*7.),0. , 1.));

    gl_FragColor = vec4(color,1.0);
}