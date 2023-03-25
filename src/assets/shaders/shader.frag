varying vec4 vColor;

void main() {
  vColor * 0.5;
  gl_FragColor = vec4(0.8, vColor.y, vColor.z, 1.0);
}