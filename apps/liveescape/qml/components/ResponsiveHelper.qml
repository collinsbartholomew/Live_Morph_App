pragma Singleton
import QtQuick

// Responsive breakpoint helper — matches Electron's @media breakpoints
// Breakpoints: 900px (tablet), 768px (mobile landscape), 480px (mobile), 360px (small mobile)
//
// Singletons have no window/parent association, so the viewport width is
// pushed in from Main.qml (win.width) instead of using the Screen attached
// property, which is undefined outside an Item-in-a-Window context.
QtObject {
    // Mutable viewport width — Main.qml keeps this in sync with the window.
    property real viewportWidth: 1280

    function syncViewport(w) {
        viewportWidth = w
    }

    // Current breakpoints
    readonly property bool isDesktop: viewportWidth >= 900
    readonly property bool isTablet: viewportWidth >= 768 && viewportWidth < 900
    readonly property bool isMobile: viewportWidth < 768
    readonly property bool isSmallMobile: viewportWidth < 480
    readonly property bool isTinyMobile: viewportWidth < 360

    // Convenience properties (viewport-relative; screen metrics are not
    // observable from a singleton)
    readonly property real screenWidth: viewportWidth
    readonly property real screenHeight: 720
    readonly property real devicePixelRatio: 1

    // Responsive spacing helpers
    readonly property int spacingXs: isDesktop ? 4 : 4
    readonly property int spacingSm: isDesktop ? 8 : 6
    readonly property int spacingMd: isDesktop ? 12 : 10
    readonly property int spacingLg: isDesktop ? 16 : 12
    readonly property int spacingXl: isDesktop ? 24 : 16

    // Responsive font sizes
    readonly property int fontSizeXs: isDesktop ? 8 : (isTablet ? 8 : 9)
    readonly property int fontSizeSm: isDesktop ? 9 : (isTablet ? 9 : 10)
    readonly property int fontSizeMd: isDesktop ? 11 : (isTablet ? 10 : 11)
    readonly property int fontSizeLg: isDesktop ? 13 : (isTablet ? 12 : 13)
    readonly property int fontSizeXl: isDesktop ? 15 : (isTablet ? 14 : 14)
    readonly property int fontSize2xl: isDesktop ? 20 : (isTablet ? 18 : 18)
    readonly property int fontSize3xl: isDesktop ? 24 : (isTablet ? 22 : 22)
    readonly property int fontSize4xl: isDesktop ? 28 : (isTablet ? 24 : 24)

    // Responsive radius
    readonly property int radiusSm: isDesktop ? 4 : 4
    readonly property int radiusMd: isDesktop ? 7 : 6
    readonly property int radiusLg: isDesktop ? 12 : 10
    readonly property int radiusXl: isDesktop ? 14 : 12
    readonly property int radius2xl: isDesktop ? 16 : 14

    // Responsive component sizes
    readonly property int buttonHeightSm: isDesktop ? 24 : 28
    readonly property int buttonHeightMd: isDesktop ? 30 : 34
    readonly property int buttonHeightLg: isDesktop ? 34 : 40
    readonly property int buttonHeightXl: isDesktop ? 44 : 48

    // Modal max widths (viewport-relative — a singleton has no `parent`)
    readonly property real modalMaxWidthSm: isDesktop ? 420 : viewportWidth * 0.94
    readonly property real modalMaxWidthMd: isDesktop ? 460 : viewportWidth * 0.94
    readonly property real modalMaxWidthLg: isDesktop ? 520 : viewportWidth * 0.94
    readonly property real modalMaxWidthXl: isDesktop ? 820 : viewportWidth * 0.94

    // Grid columns for plan cards (Electron: >=900→4, 480-899→2, <480→1)
    readonly property int planGridColumns: isDesktop ? 4 : (isSmallMobile ? 1 : 2)

    // Control bar heights
    readonly property int topBarHeight: isDesktop ? 54 : (isTablet ? 52 : 48)
    readonly property int controlsBarHeight: isDesktop ? 210 : (isTablet ? 220 : 240)

    // Column widths (viewport-relative)
    readonly property real sidebarWidth: isDesktop ? 255 : viewportWidth
    readonly property real centerColumnMinWidth: isDesktop ? 0 : viewportWidth

    // Check if we should show center bar-mid (hidden on mobile in Electron)
    readonly property bool showBarMid: isDesktop || isTablet

    // Control bar layout mode
    readonly property bool controlsSingleColumn: isMobile || isSmallMobile

    // Scanlines visibility (hidden on mobile for performance)
    readonly property bool showScanlines: isDesktop || isTablet

    // Animations
    readonly property int motionFast: 200
    readonly property int motionNormal: 250
    readonly property int motionSlow: 350

    function fontSize(baseDesktop, baseMobile) {
        return isDesktop ? baseDesktop : baseMobile;
    }

    function spacing(baseDesktop, baseMobile) {
        return isDesktop ? baseDesktop : baseMobile;
    }
}
