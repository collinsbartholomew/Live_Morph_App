cmake_minimum_required(VERSION 3.22)
project(LiveMorph VERSION 1.8.0 LANGUAGES CXX)

if(POLICY QTP0004)
    cmake_policy(SET QTP0004 NEW)
endif()

# Defines BUILD_TESTING (default ON) and calls enable_testing(), so `ctest`
# works and the smoke-test target is built by default.
include(CTest)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

find_package(Qt6 6.5 REQUIRED COMPONENTS
    Core
    Gui
    Widgets
    Qml
    Quick
    QuickControls2
    QuickDialogs2
    QuickLayouts
    QuickShapes
    QuickTemplates2
    OpenGL
    DBus
    Multimedia
    Network
    WebSockets
    Concurrent
    Svg
)

if(BUILD_TESTING)
    find_package(Qt6 6.5 REQUIRED COMPONENTS Test)
endif()

find_package(Qt6 6.5 COMPONENTS LinguistTools QUIET)

qt_standard_project_setup(REQUIRES 6.5)

add_subdirectory(../common/gstpeer ${CMAKE_BINARY_DIR}/_gstpeer)
add_subdirectory(../common/streamserver ${CMAKE_BINARY_DIR}/_streamserver)
add_subdirectory(../common/i18n ${CMAKE_BINARY_DIR}/_i18n)

set(SOURCES
    src/main.cpp
    src/core/AppController.cpp
    src/core/AuthManager.cpp
    src/core/DeviceIdentity.cpp
    src/core/SecureStore.cpp
    src/core/SessionManager.cpp
    src/core/CameraManager.cpp
    src/core/RecordingManager.cpp
    src/core/MorphRecorder.cpp
    src/core/VirtualCameraHelper.cpp
    src/core/ConfigManager.cpp
    src/core/Notifier.cpp
    src/models/CharacterCatalogModel.cpp
    src/models/PresetModel.cpp
    src/services/BackendClient.cpp
    src/services/WebRtcSignalingClient.cpp
)

set(HEADERS
    src/core/AppController.h
    src/core/AuthManager.h
    src/core/DeviceIdentity.h
    src/core/SecureStore.h
    src/core/SessionManager.h
    src/core/CameraManager.h
    src/core/RecordingManager.h
    src/core/MorphRecorder.h
    src/core/VirtualCameraHelper.h
    src/core/ConfigManager.h
    src/core/Notifier.h
    src/models/CharacterCatalogModel.h
    src/models/PresetModel.h
    src/services/BackendClient.h
    src/services/WebRtcSignalingClient.h
)

qt_add_executable(LiveMorph
    WIN32 MACOSX_BUNDLE
    ${SOURCES}
    ${HEADERS}
)

# Custom Info.plist so the livemorph:// URL scheme (OAuth/payment callbacks)
# is registered in the macOS bundle.
if(APPLE)
    set_target_properties(LiveMorph PROPERTIES
        MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_SOURCE_DIR}/packaging/Info.plist")
endif()

# Mark theme/constants as QML singletons (required for Colors/Theme/Constants)
set_source_files_properties(
    qml/theme/Colors.qml
    qml/theme/Theme.qml
    qml/constants/Constants.qml
    qml/PlatformSettings.qml
    PROPERTIES QT_QML_SINGLETON_TYPE TRUE
)

# Source QML dir path baked in for --dev hot-reload mode (loads QML from disk
# instead of the compiled qrc module, then reloads on file change).
# App version comes from project() so the binary, the title bar and the
# X-App-Version header can never drift apart.
target_compile_definitions(LiveMorph PRIVATE
    LIVEMORPH_QML_SOURCE_DIR="${CMAKE_CURRENT_SOURCE_DIR}/qml"
    LIVEMORPH_APP_VERSION="${PROJECT_VERSION}")

qt_add_qml_module(LiveMorph
    URI LiveMorph
    VERSION 1.8.0
        QML_FILES
        qml/main.qml
        qml/theme/Theme.qml
        qml/theme/Colors.qml
        qml/constants/Constants.qml
        qml/components/TitleBar.qml
        qml/components/Spinner.qml
        qml/components/StyledScrollBar.qml
        qml/components/PrimaryButton.qml
        qml/components/SecondaryButton.qml
        qml/components/GhostButton.qml
        qml/components/TextField.qml
        qml/components/StatusPill.qml
        qml/components/Tooltip.qml
        qml/components/SegmentedControl.qml
        qml/components/Switch.qml
        qml/components/ConfirmDialog.qml
        qml/components/IconButton.qml
        qml/components/FocusRing.qml
        qml/components/NotificationCenter.qml
        qml/components/HelpDrawer.qml
        qml/components/SettingsDrawer.qml
        qml/components/BuyCreditsDrawer.qml
        qml/components/CheckoutSheet.qml
        qml/components/NotificationToastHost.qml
        qml/components/PaymentInFlightBanner.qml
        qml/components/OnboardingTour.qml
        qml/components/WhatsNewModal.qml
        qml/components/ShortcutsSheet.qml
        qml/components/BrandingFooter.qml
        qml/components/Icon.qml
        qml/components/UploadConsentDialog.qml
        qml/components/Honeycomb.qml
        qml/components/Hexagon.qml
        qml/components/HexBadge.qml
        qml/components/BrandMark.qml
        qml/components/EmptyState.qml
        qml/components/SectionHeader.qml
        qml/components/CornerTicks.qml
        qml/PlatformSettings.qml
        qml/pages/AuthScreen.qml
        qml/pages/Dashboard.qml
        qml/pages/PreviewWindow.qml
        qml/pages/PopoutWindow.qml
        qml/dashboard/TopBar.qml
        qml/dashboard/StatusBar.qml
        qml/dashboard/StageFrame.qml
        qml/dashboard/MorphStage.qml
        qml/dashboard/InputPiP.qml
        qml/dashboard/ActionBar.qml
        qml/dashboard/WorkshopPanel.qml
        qml/dashboard/PresetGrid.qml
        qml/dashboard/CharacterCard.qml
        qml/dashboard/StageControls.qml
        qml/components/ToggleRow.qml
        qml/dashboard/CustomizeForm.qml

        qml/dashboard/PromptCommitBar.qml
        qml/screens/DownloadsScreen.qml
        qml/components/LockScreen.qml
    RESOURCES
        resources/resources.qrc
)

target_include_directories(LiveMorph PRIVATE src)

target_link_libraries(LiveMorph PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
    Qt6::Qml
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::QuickDialogs2
    Qt6::QuickLayouts
    Qt6::QuickShapes
    Qt6::QuickTemplates2
    Qt6::OpenGL
    Qt6::DBus
    Qt6::Multimedia
    Qt6::Network
    Qt6::WebSockets
    Qt6::Concurrent
    Qt6::Svg
    GstRtcPeer
    StreamServer
    CommonI18n
)

# Smoke tests — run with `ctest` (BUILD_TESTING defaults ON via include(CTest))
# or directly: QT_QPA_PLATFORM=offscreen ./bin/LiveMorph_smoke_test
# Only self-contained, dependency-free components (catalog + presets models) are
# exercised; full app integration requires the backend + GStreamer pipeline.
if(BUILD_TESTING)
    add_executable(LiveMorph_smoke_test tests/smoke.cpp
        src/models/CharacterCatalogModel.cpp src/models/PresetModel.cpp)
    target_link_libraries(LiveMorph_smoke_test PRIVATE
        Qt6::Core Qt6::Gui Qt6::Test Qt6::Network Qt6::Qml CommonI18n)
    target_include_directories(LiveMorph_smoke_test PRIVATE src ../common/i18n)
    add_test(NAME lm_smoke COMMAND LiveMorph_smoke_test)
    set_tests_properties(lm_smoke PROPERTIES ENVIRONMENT "QT_QPA_PLATFORM=offscreen")
endif()

# Install
install(TARGETS LiveMorph
    BUNDLE DESTINATION .
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)

if(UNIX AND NOT APPLE)
    install(FILES packaging/livemorph.desktop
            DESTINATION ${CMAKE_INSTALL_DATADIR}/applications)
    install(FILES resources/assets/livemorph-icon.png
            DESTINATION ${CMAKE_INSTALL_DATADIR}/icons/hicolor/256x256/apps
            RENAME livemorph.png)
endif()



# ── i18n: English-only .ts for lupdate scanning + embedded catalog ─────
set(LIVEMORPH_TS_FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_en.ts
)

if(TARGET Qt6::lrelease OR Qt6LinguistTools_FOUND)
    qt_add_translations(LiveMorph
        TS_FILES ${LIVEMORPH_TS_FILES}
        RESOURCE_PREFIX "/i18n"
        # NOTE: -compress is an lrelease-only flag; lupdate rejects it and the
        # generated lupdate target would always fail. Keep lupdate options empty.
        LUPDATE_OPTIONS
    )
    message(STATUS "Qt LinguistTools: qt_add_translations enabled (English catalog only)")
else()
    message(WARNING "Qt LinguistTools not found — online translation will still work")
endif()

# Embed English .ts as resource for runtime string catalog parsing
qt_add_resources(LiveMorph "i18n_catalog"
    PREFIX "/i18n"
    FILES i18n/livemorph_en.ts
    BASE "i18n"
)

# ── Install + packaging ──────────────────────────────────────────────
include(GNUInstallDirs)

# CPack — produce platform archives; run windeployqt/macdeployqt after install
set(CPACK_PACKAGE_NAME "LiveMorph")
set(CPACK_PACKAGE_VENDOR "LiveMorph")
set(CPACK_PACKAGE_VERSION "${PROJECT_VERSION}")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "LiveMorph desktop — AI face morph")
set(CPACK_PACKAGE_CONTACT "support@livemorph.local")
set(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_CURRENT_SOURCE_DIR}/LICENSE")
if(WIN32)
    set(CPACK_GENERATOR "ZIP;NSIS")
    set(CPACK_NSIS_DISPLAY_NAME "LiveMorph")
    set(CPACK_NSIS_PACKAGE_NAME "LiveMorph")
    set(CPACK_NSIS_ENABLE_UNINSTALL_BEFORE_INSTALL ON)
    # Register the livemorph:// protocol at INSTALL time (HKCU), so the Google
    # OAuth / payment deep-link return launches the app on Windows end users.
    set(CPACK_NSIS_EXTRA_INSTALL_COMMANDS "
      WriteRegStr HKCU \"Software\\\\Classes\\\\livemorph\" \"URL Protocol\" \"\"
      WriteRegStr HKCU \"Software\\\\Classes\\\\livemorph\\\\shell\\\\open\\\\command\" \"\" \"\\\"$INSTDIR\\\\bin\\\\LiveMorph.exe\\\" \\\"%1\\\"\"
    ")
    set(CPACK_NSIS_EXTRA_UNINSTALL_COMMANDS "
      DeleteRegKey HKCU \"Software\\\\Classes\\\\livemorph\"
    ")
elseif(APPLE)
    set(CPACK_GENERATOR "DragNDrop")
    set(CPACK_DMG_VOLUME_NAME "LiveMorph")
else()
    set(CPACK_GENERATOR "TGZ;DEB")
    set(CPACK_DEBIAN_PACKAGE_MAINTAINER "LiveMorph")
    set(CPACK_DEBIAN_PACKAGE_DEPENDS "libc6, libqt6core6, libqt6gui6, libqt6widgets6, libqt6qml6, libqt6qmlmodels2, libqt6quick6, libqt6quickcontrols2-6, libqt6quickdialogs2-6, libqt6quicklayouts6, libqt6quickshapes6, libqt6quicktemplates2-6, libqt6opengl6, libqt6dbus6, libqt6multimedia6, libqt6network6, libqt6websockets6, libqt6svg6, libqt6concurrent6, qml6-module-qtquick, qml6-module-qtquick-controls, qml6-module-qtquick-layouts, qml6-module-qtquick-shapes, qml6-module-qtquick-dialogs, qml6-module-qtquick-window, qml6-module-qtquick-templates, qml6-module-qtqml, qml6-module-qtqml-models2, qml6-module-qtmultimedia, libgstreamer1.0-0, libgstapp-1.0-0, libgstbase-1.0-0, libgstsdp-1.0-0, libgstvideo-1.0-0, libgstwebrtc-1.0-0, libglib2.0-0, gstreamer1.0-plugins-base, gstreamer1.0-plugins-bad, gstreamer1.0-plugins-good, gstreamer1.0-libav, libnice10")
endif()
include(CPack)

# Helper target: deploy Qt runtime beside the binary
find_program(WINDEPLOYQT_EXECUTABLE windeployqt HINTS "${Qt6_DIR}/../../../bin")
find_program(MACDEPLOYQT_EXECUTABLE macdeployqt HINTS "${Qt6_DIR}/../../../bin")
if(WINDEPLOYQT_EXECUTABLE)
    add_custom_target(deploy-win
        COMMAND "${WINDEPLOYQT_EXECUTABLE}" --release --qmldir "${CMAKE_SOURCE_DIR}/qml"
                "$<TARGET_FILE:LiveMorph>"
        DEPENDS LiveMorph
        COMMENT "windeployqt: bundle Qt DLLs"
    )
endif()
if(MACDEPLOYQT_EXECUTABLE)
    add_custom_target(deploy-mac
        COMMAND "${MACDEPLOYQT_EXECUTABLE}" "$<TARGET_BUNDLE_DIR:LiveMorph>"
                -qmldir="${CMAKE_SOURCE_DIR}/qml" -always-overwrite
        DEPENDS LiveMorph
        COMMENT "macdeployqt: bundle Qt into .app"
    )
endif()
