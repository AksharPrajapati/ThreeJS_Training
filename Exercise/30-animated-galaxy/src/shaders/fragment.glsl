varying vec3 vColor;

void main()
{
    // get disc pattern
    // float strengh = distance(gl_PointCoord, vec2(0.5));
    // strengh = step(0.5, strengh);
    // strengh = 1.0 - strengh;

    //get diffuse pattern
    float strengh = distance(gl_PointCoord, vec2(0.5));
    strengh *= 2.0;
    strengh = 1.0 - strengh;

    vec3 finalColor = mix(vec3(0.0), vColor, strengh);

    gl_FragColor = vec4(finalColor, 1.0);
}