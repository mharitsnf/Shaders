// Author: Mohamad Harits NF
// Title: fBM + Voronoi

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

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

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 4.000;
        amplitude *= 0.204;
    }
    return value;
}

vec2 skew (vec2 st) {
    vec2 r = vec2(0.0);
    r.x = 1.1547*st.x;
    r.y = st.y+0.5*r.x;
    return r;
}

vec3 col255to1 (vec3 col) {
    return col / 255.;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    st *= 2.5;
    vec2 i_st = floor(skew(st));
    vec2 f_st = fract(skew(st));
    
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    float f = fbm(st+r);
    f_st += (f * f * f * 5.) + f * .3 + length(r * .1) - length(q * .2);
    
    float m_dist = 1.;
    
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            
            vec2 neighbor_offset = vec2(x, y);
            
            vec2 point = random2(i_st + neighbor_offset);
            point = 0.8 + 0.05*sin(u_time + 6.2831*point);
            
            vec2 diff = neighbor_offset + point - f_st;
            float len = smoothstep(-0.244, 1.548, length(diff));
            // float len = length(diff);
            m_dist = min(m_dist, len);
        }
    }
    
    vec3 color = mix(col255to1(vec3(7., 133., 135.)),
                col255to1(vec3(163, 210, 202)),
                clamp((m_dist*m_dist)*4.0,0.0,1.0));
    
    color = mix(color,
                col255to1(vec3(94, 170, 168)),
                clamp(m_dist*m_dist*q.r,0.0,1.0));
    
    color = mix(color,
                col255to1(vec3(16., 25., 53.)),
                clamp(length(r.x),0.0,1.0));

    gl_FragColor = vec4((m_dist*2. + m_dist * m_dist * m_dist + m_dist * .4) * color,1.0);
}