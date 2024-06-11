uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;


void main()
{
    // displacement
    vec3 newPosition = position;
    float displacementIntensity = smoothstep(0.1, 0.3, texture(uDisplacementTexture, uv).r);

    // elevation
    vec3 displacement = vec3(cos(aAngle) * 0.2, sin(aAngle) * 0.2, 1.0);
    displacement = normalize(displacement); 
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;

    newPosition += displacement;
    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // use the texture to displace the vertex position


    // Picture
    float pictureIntensity = texture(uPictureTexture, uv).r;
    // Point size
    gl_PointSize = 0.15 * uResolution.y * pictureIntensity;
    gl_PointSize *= (1.0 / - viewPosition.z);


    // varyings
    vColor = vec3(pow(pictureIntensity, 2.0));

}