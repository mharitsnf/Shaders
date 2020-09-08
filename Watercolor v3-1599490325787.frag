// Author: Mohamad Harits NF
// Title: Watercolor v3.1

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

vec2 voronoi(vec2 i_st, vec2 f_st, float t) {
    float m_dist = 8.;
    vec2 md, mnb;
    
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++) {
    	vec2 nb = vec2(x, y);
        vec2 p = random2(i_st + nb);
        p = 0.5 + 0.5*sin(t + 6.2831*p);
        vec2 d = nb + p - f_st;
        float l = length(d);
        
        if (l < m_dist) {
            m_dist = l;
            md = d;
            mnb = nb;
		}
    }
    
    m_dist = 8.;
    for (int x = -2; x <= 2; x++)
    for (int y = -2; y <= 2; y++) {
    	vec2 nb = mnb+vec2(x, y);
        vec2 p = random2(i_st + nb);
        p = 0.5 + 0.5*sin(t + 6.2831*p);
        vec2 d = nb + p - f_st;
        
        float l = length(md-d);
        
        if (l > 0.00001)
        m_dist = min(m_dist, dot( 0.892*(md+d), normalize(d-md) ));
    }
    
    return vec2(m_dist, md);
}

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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    float t = u_time * 0.124;
    
    // Watercolor gradient
    vec2 st2 = st*4. + t * .3;
    st2.x += sin(st2.x * 0.588 + t * 0.472) * 0.068;
    st2.x += sin(st2.x * 0.356 + t * 0.392) * 0.444;
    st2.x += sin(st2.x * 0.628 + t * 0.312) * 0.548;

    vec2 w = vec2(0.);
    w.x = fbm(st2 + vec2(.3, .1) + t * 0.940);
    w.y = fbm(st2 + vec2(.4, .8) + t * 0.442);
    
    vec2 e = vec2(0.);
    e.x = fbm(st2 + 1.*w + vec2(.47812, .74823) + t * 0.540);
    e.y = fbm(st2 + 1.*w + vec2(0.340,0.210) + t * 0.304);
    
    float q = fbm(st2 + 3.*e);
    
    vec2 st1 = st*2.;
    st1.y += sin(st1.x * .5 + t * .8) * 0.324;
    st1.y -= sin(st1.x * 0.310 + t * .5) * 0.168;
    st1.y += sin(st1.x * 0.638 + t * 0.204) * 0.160;
    st1.y += sin(st1.x * 0.726 - t * 0.468) * 0.144;
    
    st1.x += sin(st1.y * 0.340 + t * 0.840) * 0.260;
    st1.x -= sin(st1.y * 0.686 + t * 0.364) * 0.184;
    st1.x += sin(st1.y * 0.526 + t * 0.204) * 0.088;
    st1.x -= sin(st1.y * 0.726 - t * 0.468) * 0.184;
    
	st1.x += e.x * 0.616;
	st1.y += e.y * 0.224 ;   
    
    vec2 i_st1 = floor(st1);
    vec2 f_st1 = fract(st1);
    
    vec2 vor = voronoi(i_st1, f_st1, t);
	float mask = mix(1.-vor.x, q, 0.468);
    
    vec3 blue1 = col255to1(vec3(77, 156, 219));
    vec3 blue2 = col255to1(vec3(47, 54, 189));
    vec3 green1 = col255to1(vec3(113, 139, 245));
    vec3 db1 = col255to1(vec3(45, 35, 94));
    
    vec3 color = mix(blue2, blue1, clamp(mask * mask * mask * 2., 0., 1.));
    vec3 color2 = mix(db1, green1, clamp(mask * mask * 2.020, 0., 1.));
    vec3 fcol = mix(color2, color, mask);

    gl_FragColor = vec4(fcol,1.0);
}