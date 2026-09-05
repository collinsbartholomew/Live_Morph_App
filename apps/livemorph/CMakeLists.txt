cmake_minimum_required(VERSION 3.22)
project(LiveMorph VERSION 1.8.0 LANGUAGES CXX)

if(POLICY QTP0004)
    cmake_policy(SET QTP0004 NEW)
endif()

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
    Multimedia
    Network
    WebSockets
    Concurrent
    Svg
)

find_package(Qt6 6.5 COMPONENTS LinguistTools QUIET)

qt_standard_project_setup(REQUIRES 6.5)

add_subdirectory(../common/gstpeer ${CMAKE_BINARY_DIR}/_gstpeer)

set(SOURCES
    src/main.cpp
    src/core/AppController.cpp
    src/core/AuthManager.cpp
    src/core/DeviceIdentity.cpp
    src/core/SecureStore.cpp
    src/core/SessionManager.cpp
    src/core/CameraManager.cpp
    src/core/RecordingManager.cpp
    src/core/StreamServer.cpp
    src/core/VirtualCameraHelper.cpp
    src/core/ConfigManager.cpp
    src/core/I18nManager.cpp
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
    src/core/StreamServer.h
    src/core/VirtualCameraHelper.h
    src/core/ConfigManager.h
    src/core/I18nManager.h
    src/core/Notifier.h
    src/models/CharacterCatalogModel.h
    src/models/PresetModel.h
    src/services/BackendClient.h
    src/services/WebRtcSignalingClient.h
)

qt_add_executable(LiveMorph
    ${SOURCES}
    ${HEADERS}
)

# Mark theme/constants as QML singletons (required for Colors/Theme/Constants)
set_source_files_properties(
    qml/theme/Colors.qml
    qml/theme/Theme.qml
    qml/constants/Constants.qml
    PROPERTIES QT_QML_SINGLETON_TYPE TRUE
)

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
        qml/pages/AuthScreen.qml
        qml/pages/Dashboard.qml
        qml/pages/Settings.qml
        qml/pages/BuyCredits.qml
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
        qml/dashboard/CustomizeForm.qml
        qml/dashboard/StageControls.qml
        qml/dashboard/PromptCommitBar.qml
        qml/dashboard/WorkingWithChip.qml
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
    Qt6::Multimedia
    Qt6::Network
    Qt6::WebSockets
    Qt6::Concurrent
    Qt6::Svg
    GstRtcPeer
)

# Install
install(TARGETS LiveMorph
    BUNDLE DESTINATION .
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)



# ── Qt6 Linguist / translator plugin (wide language reach) ─────────────
# Generates .qm at build time and embeds via resources when possible.
set(LIVEMORPH_TS_FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_en.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_es.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_fr.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_de.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_pt.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_zh.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_ja.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_ko.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_ru.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_ar.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_it.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_hi.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_id.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_nl.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_tr.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_pl.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_vi.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_th.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_uk.ts
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/livemorph_sv.ts
)

if(TARGET Qt6::lrelease OR Qt6LinguistTools_FOUND)
    # Modern CMake API: updates .ts from sources + builds .qm
    qt_add_translations(LiveMorph
        TS_FILES ${LIVEMORPH_TS_FILES}
        RESOURCE_PREFIX "/i18n"
        LUPDATE_OPTIONS -compress -nounfinished
    )
    message(STATUS "Qt LinguistTools: qt_add_translations enabled (${CMAKE_CURRENT_SOURCE_DIR}/i18n)")
else()
    message(WARNING "Qt LinguistTools not found — ship prebuilt i18n/*.qm or install qt6-tools")
endif()

# ── Install + packaging ──────────────────────────────────────────────
include(GNUInstallDirs)

# QML/resources are embedded via qt_add_qml_module / qt_add_resources

# Optional: install i18n .qm next to binary for runtime discovery
install(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/i18n/
    DESTINATION ${CMAKE_INSTALL_DATADIR}/livemorph/i18n
    FILES_MATCHING PATTERN "*.qm"
)

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
elseif(APPLE)
    set(CPACK_GENERATOR "DragNDrop")
    set(CPACK_DMG_VOLUME_NAME "LiveMorph")
else()
    set(CPACK_GENERATOR "TGZ;DEB")
    set(CPACK_DEBIAN_PACKAGE_MAINTAINER "LiveMorph")
    set(CPACK_DEBIAN_PACKAGE_DEPENDS "libc6")
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
