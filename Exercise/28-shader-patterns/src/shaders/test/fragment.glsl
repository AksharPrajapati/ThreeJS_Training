#define pi 3.1415926535897932384626433832795

varying vec2 vuv;

 float random (vec2 vuv) {
    return fract(sin(dot(vuv.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    //Pattern 1
    // (vuv.x, vuv.y, 1.0, 1.0)

    //Pattern 2
    // (vuv.x, vuv.y, 0.0, 1.0)

    //Pattern 3
    // (vec3(vuv.x), 1.0)
    // float strengh = vuv.x;

     //Pattern 4
    // float strengh = vuv.y;

     //Pattern 5
    // float strengh = 1.0 - vuv.y;

    // pattern 6
    // float strengh = vuv.y * 10.0;

    // pattern 7
    // float strengh = mod(vuv.y * 10.0, 1.0);

    // pattern 8
    // float strengh = mod(vuv.y * 10.0, 1.0);
    // strengh = strengh > 0.5 ? 0.0 : 1.0;
    // strengh = step(0.5, strengh);

     // pattern 9
    // float strengh = mod(vuv.y * 10.0, 1.0);
    // strengh = strengh > 0.5 ? 0.0 : 1.0;
    // strengh = step(0.8, strengh);

  // pattern 10
    // float strengh = mod(vuv.x * 10.0, 1.0);
     // strengh = step(0.8, strengh);

    // pattern 11
    float strengh = step(0.8, mod(vuv.x * 10.0, 1.0));
    strengh += step(0.8, mod(vuv.y * 10.0, 1.0));

    
    // pattern 12
    // float strengh = step(0.8, mod(vuv.x * 10.0, 1.0));
    // strengh *= step(0.8, mod(vuv.y * 10.0, 1.0));

    // pattern 13
    // float strengh = step(0.8, mod(vuv.y * 10.0, 1.0));
    // strengh -= step(0.6, mod(vuv.x * 10.0, 1.0));
    //  OR
    // float strengh = step(0.4, mod(vuv.x * 10.0, 1.0));
    // strengh *= step(0.8, mod(vuv.y * 10.0, 1.0));

    // pattern 14
    // float barX = step(0.8, mod(vuv.y * 10.0, 1.0));
    // barX *= step(0.4, mod(vuv.x * 10.0, 1.0));

    // float barY = step(0.4, mod(vuv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vuv.x * 10.0, 1.0));

    // float strengh = barX + barY;

    // pattern 15
    // float barX = step(0.8, mod(vuv.y * 10.0 + 0.2, 1.0));
    // barX *= step(0.4, mod(vuv.x * 10.0 , 1.0)); // offset

    // float barY = step(0.4, mod(vuv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vuv.x * 10.0 + 0.2, 1.0));

    // float strengh = barX + barY;

  //pattern 16
//    float strengh = abs(vuv.x -  0.5);

//pattern 17
//    float strengh = min(abs(vuv.x -  0.5), abs(vuv.y -  0.5));

//pattern 18
//    float strengh = max(abs(vuv.x -  0.5), abs(vuv.y -  0.5));

//pattern 19
//    float strengh = step(0.2,max(abs(vuv.x -  0.5), abs(vuv.y -  0.5)));

//pattern 20
//    float strengh = step(0.4, max(abs(vuv.x -  0.5), abs(vuv.y -  0.5)));

//patter 21
    // float strengh = floor(vuv.x * 10.0) / 10.0;

    //patter 22
    // float strengh = floor(vuv.x * 10.0) / 10.0;
    // strengh *= floor(vuv.y * 10.0) / 10.0;

    //patter 23
    // float strengh = random(vuv);

    //patter 25
    // vec2 gridVuv = vec2(floor(vuv.x * 10.0) / 10.0, floor(vuv.y * 10.0) / 10.0);
    // float strengh = random(gridVuv);
    
   //patter 26
    // vec2 gridVuv = vec2(floor(vuv.x * 10.0) / 10.0, floor((vuv.y + vuv.x * 0.5) * 10.0) / 10.0);
    // float strengh = random(gridVuv);

      //patter 27
//    float strengh = length(vuv - 0.5);
    //  float strengh = distance(vuv, vec2(0.5));

   //patter 28
//    float strengh = 1.0 - length(vuv - 0.5);

     //patter 29
//    float strengh = 0.015 / distance(vuv, vec2(0.5));

        //patter 30
//         vec2 lightUv = vec2(
//             vuv.x * 0.2 + 0.4,
//             vuv.y
//         );
//    float strengh = 0.015 / distance(lightUv, vec2(0.5));

//patter 31
        // vec2 lightUvX = vec2(
        //     vuv.x * 0.2 + 0.4,
        //     vuv.y
        // );
        // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

        // vec2 lightUvY = vec2(
        //     vuv.x ,
        //     vuv.y * 0.2 + 0.4
        // );
        // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

        // float strengh = lightX * lightY;

        //pattern 32

        // vec2 rotateUv = rotate(vuv, pi * 0.2 , vec2(0.5));
        // vec2 lightUvX = vec2(
        //     rotateUv.x * 0.2 + 0.4,
        //     rotateUv.y
        // );
        // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

        // vec2 lightUvY = vec2(
        //     rotateUv.x ,
        //     rotateUv.y * 0.2 + 0.4
        // );
        // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

        // float strengh = lightX * lightY;

        //Pattern 33
        //  float strengh =  step(0.3, distance(vuv,vec2(0.5))) ;

        //pattern 34
        //  float strengh =  abs(distance(vuv,vec2(0.5)) - 0.25);

         //pattern 35
        //  float strengh =  step(0.01,abs(distance(vuv,vec2(0.5)) - 0.25));

          //pattern 36
        //  float strengh =  1.0 - step(0.01,abs(distance(vuv,vec2(0.5)) - 0.25));

             //pattern 37
        //  float strengh =  1.0 - step(0.01,abs(distance(vuv,vec2(0.5)) - 0.25));

         //pattern 38
        //  vec2 wavedUv = vec2(
        //      vuv.x,
        //      vuv.y + sin(vuv.x * 30.0) * 0.1
        //  );
        //  float strengh =  1.0 - step(0.01,abs(distance(wavedUv,vec2(0.5)) - 0.25));

            //pattern 39
        //  vec2 wavedUv = vec2(
        //      vuv.x + sin(vuv.y * 30.0) * 0.1,
        //      vuv.y + sin(vuv.x * 30.0) * 0.1
        //  );
        //  float strengh =  1.0 - step(0.01,abs(distance(wavedUv,vec2(0.5)) - 0.25));

           //pattern 40
        //  vec2 wavedUv = vec2(
        //      vuv.x + sin(vuv.y * 100.0) * 0.1,
        //      vuv.y + sin(vuv.x * 100.0) * 0.1
        //  );
        //  float strengh =  1.0 - step(0.01,abs(distance(wavedUv,vec2(0.5)) - 0.25));

        // pattern 41
        // float angle = atan(vuv.x, vuv.y);
        //  float strengh = angle;

           // pattern 42
        // float angle = atan(vuv.x - 0.5, vuv.y - 0.5);
        //  float strengh = angle;

            // pattern 43
        // float angle = atan(vuv.x - 0.5, vuv.y - 0.5);
        // angle /= pi * 2.0;
        // angle += 0.5;
        //  float strengh = angle;

        //   pattern 44
        //  float angle = atan(vuv.x - 0.5, vuv.y - 0.5);
        // angle /= pi * 2.0;
        // angle += 0.5;
        // angle = mod(angle * 20.0, 1.0);
        //  float strengh = angle;

         //   pattern 45
        //  float angle = atan(vuv.x - 0.5, vuv.y - 0.5);
        // angle /= pi * 2.0;
        // angle += 0.5;
        // angle = sin(angle * 100.0);
        // float strengh = angle;

        //pattern 46
        //  float angle = atan(vuv.x - 0.5, vuv.y - 0.5);
        // angle /= pi * 2.0;
        // angle += 0.5;
        // angle = sin(angle * 100.0);
        // float sinValue = angle;
        // float radius = 0.25 + sinValue * 0.02;
        // float strengh = 1.0 - step(0.01,abs(distance(vuv, vec2(0.5)) - radius));

        //Pattern 47
        // float strengh = cnoise(vuv * 10.0) ;

         //Pattern 48
        // float strengh = step(0.0,cnoise(vuv * 10.0)) ;


         //Pattern 49
        // float strengh = 1.0 - abs(cnoise(vuv * 10.0));

        //Pattern 50
        // float strengh = sin(cnoise(vuv * 10.0) * 40.0) ;

        //pattern 51
        // float strengh = step(0.5, sin(cnoise(vuv * 10.0) * 20.0)) ;

        // Fix Strengh
        strengh = clamp(strengh, 0.0, 1.0);

        //Colored Version
        vec3 blackColor = vec3(0.0);
        vec3 vuvColor = vec3(vuv, 0.5);
        vec3 mixColor = mix(blackColor, vuvColor, strengh);
        gl_FragColor = vec4(mixColor, 1.0); 

        //Black and White Version
        //gl_FragColor = vec4(vec3(strengh), 1.0);
}