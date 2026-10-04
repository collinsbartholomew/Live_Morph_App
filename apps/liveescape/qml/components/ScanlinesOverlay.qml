import QtQuick

// Scanlines overlay matching Electron's .stage::after
// repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 0, 0, .015) 3px, rgba(0, 0, 0, .015) 6px)
ShaderEffect {
    id: root
    property real patternSize: height / 6.0 * 2.0
    anchors.fill: parent

    fragmentShader: "
        uniform lowp float qt_Opacity;
        varying highp vec2 qt_TexCoord0;
        uniform highp float patternSize;
        void main() {
            // Scanline pattern: 3px transparent, 3px dark
            float line = mod(qt_TexCoord0.y * patternSize, 6.0);
            float alpha = step(3.0, line) * 0.015;
            gl_FragColor = vec4(0.0, 0.0, 0.0, alpha) * qt_Opacity;
        }
    "
}