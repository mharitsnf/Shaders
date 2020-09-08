// Author: Mohamad Harits NF
// Title: Live Blocks

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 random3(vec3 c) {
    float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
    vec3 r;
    r.z = fract(512.0*j);
    j *= .125;
    r.x = fract(512.0*j);
    j *= .125;
    r.y = fract(512.0*j);
    return r-0.5;
}

const float F3 =  0.3333333;
const float G3 =  0.1666667;
float snoise(vec3 p) {

    vec3 s = floor(p + dot(p, vec3(F3)));
    vec3 x = p - s + dot(s, vec3(G3));

    vec3 e = step(vec3(0.0), x - x.yzx);
    vec3 i1 = e*(1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy*(1.0 - e);

    vec3 x1 = x - i1 + G3;
    vec3 x2 = x - i2 + 2.0*G3;
    vec3 x3 = x - 1.0 + 3.0*G3;

    vec4 w, d;

    w.x = dot(x, x);
    w.y = dot(x1, x1);
    w.z = dot(x2, x2);
    w.w = dot(x3, x3);

    w = max(0.6 - w, 0.0);

    d.x = dot(random3(s), x);
    d.y = dot(random3(s + i1), x1);
    d.z = dot(random3(s + i2), x2);
    d.w = dot(random3(s + 1.0), x3);

    w *= w;
    w *= w;
    d *= w;

    return dot(d, vec4(52.0));
}

vec3 col255to1(vec3 col) {
    return col / 255.;
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;
    
    vec3 indigo = col255to1(vec3(22., 66., 91.));
    vec3 dsb = col255to1(vec3(129., 195., 215.));
    
    vec2 uv1 = uv;
    
    uv *= 11.;
    float sn = snoise(vec3(uv, u_time));
    float sn2 = snoise(vec3(uv, u_time - 100.));
    float oddRow = step(1., mod(uv.y, 2.));
    float oddCol = step(1., mod(uv.x, 2.));
    uv = fract(uv);
    
    vec2 bl = step(vec2(.1), uv);
    vec2 tr = step(vec2(.1), 1.-uv);
    
    float boxes = oddRow * oddCol;
    float boxesMini = boxes * (bl.x * bl.y * tr.x * tr.y);

    vec3 color = vec3((step(0., sn + sn2) * boxesMini)) * indigo;

    gl_FragColor = vec4(color,1.0);
}