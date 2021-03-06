// Author: Mohamad Harits NF
// Title: Watercolor Voronoi fBM

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

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
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

#define OCTAVES 8
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

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.5),
                         _radius+(_radius*0.5),
                         dot(l,l)*4.);
}

float voronoi(vec2 i_st, vec2 f_st) {
    float m_dist = 1.;
    
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++) {
    	vec2 nb = vec2(x, y);
        vec2 p = random2(i_st + nb);
        p = 0.5 + 0.5*sin(u_time*.3 + 6.2831*p);
        vec2 d = nb + p - f_st;
        float l = length(d);
        m_dist = min(m_dist, l*m_dist);
    }
    
    return m_dist;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    // Watercolor gradient
    vec2 st1 = st*5.;
    float t = u_time * .2;

    vec2 w = vec2(0.);
    w.x = fbm(st1 + vec2(.3, .1) + t * 0.280);
    w.y = fbm(st1 + vec2(.4, .8) + t * 0.480);
    
    vec2 e = vec2(0.);
    e.x = fbm(st1 + 1.*w + vec2(.47812, .74823) + t * 0.160);
    e.y = fbm(st1 + 1.*w + vec2(0.340,0.210) + t * 0.164);
    
    float q = fbm(st1 + 3.*e);
    
    // Voronoi
    vec2 st2 = st*2.;
    st2.x += q * 2. + fbm(st2) * .3;
    st2.y += q * 4. + fbm(st2) * .3;
    vec2 i_st2 = floor(st2);
    vec2 f_st2 = fract(st2);
    float vor = voronoi(i_st2, f_st2);
    vor = smoothstep(0.116, 0.908, vor);
    
    vec3 blue1 = col255to1(vec3(55, 125, 179));
    vec3 blue2 = col255to1(vec3(34, 38, 117));
    vec3 green1 = col255to1(vec3(59, 191, 187));
    vec3 db1 = col255to1(vec3(45, 35, 94));
    
    vec3 color = mix(blue2, blue1, clamp((vor*5.), 0., 1.));
    color = mix(color, green1, clamp((vor * vor * vor), 0., 1.));
    color = mix(db1, color, clamp((vor * 1.), 0. , 1.));

    gl_FragColor = vec4(color,1.0);
}