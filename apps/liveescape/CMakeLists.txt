cmake_minimum_required(VERSION 3.22)
project(LiveEscape VERSION 1.8.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

find_package(Qt6 6.8 REQUIRED COMPONENTS
    Core Gui Widgets Quick QuickControls2 Network Multimedia
)
find_package(Qt6 6.8 COMPONENTS LinguistTools QUIET)

find_package(Qt6 6.8 COMPONENTS WebSockets QUIET)
set(SS_HAS_WS FALSE)
if(TARGET Qt6::WebSockets)
    set(SS_HAS_WS TRUE)
endif()
if(SS_HAS_WS)
    add_compile_definitions(SS_HAS_WEBSOCKETS=1)
else()
    add_compile_definitions(SS_HAS_WEBSOCKETS=0)
endif()

qt_standard_project_setup(REQUIRES 6.8)

add_subdirectory(../common/gstpeer ${CMAKE_BINARY_DIR}/_gstpeer)
add_subdirectory(../common/streamserver ${CMAKE_BINARY_DIR}/_streamserver)
add_subdirectory(../common/i18n ${CMAKE_BINARY_DIR}/_i18n)

set(SS_SOURCES
    src/main.cpp
    src/core/MachineIdProvider.cpp
    src/core/MachineIdProvider.h
    src/core/ApiClient.cpp
    src/core/ApiClient.h
    src/core/SecureStore.cpp
    src/core/SecureStore.h
    src/core/SessionManager.cpp
    src/core/SessionManager.h
    src/core/AppController.cpp
    src/core/AppController.h
    src/core/UpdateChecker.cpp
    src/core/UpdateChecker.h
    src/core/StreamController.cpp
    src/core/StreamController.h
    src/core/WebSocketClient.cpp
    src/core/DecartSignalingClient.cpp
    src/core/WebSocketClient.h
    src/core/DecartSignalingClient.h
)

qt_add_executable(LiveEscape ${SS_SOURCES})

set_source_files_properties(qml/theme/Theme.qml PROPERTIES QT_QML_SINGLETON_TYPE TRUE)
set_source_files_properties(qml/Settings.qml PROPERTIES QT_QML_SINGLETON_TYPE TRUE)
set_source_files_properties(qml/components/ResponsiveHelper.qml PROPERTIES QT_QML_SINGLETON_TYPE TRUE)

qt_add_qml_module(LiveEscape
    URI LiveEscape
    VERSION 1.0
    QML_FILES
        qml/Main.qml
        qml/theme/Theme.qml
        qml/Settings.qml
        qml/PopoutWindow.qml
        qml/PreviewWindow.qml
        qml/components/GoldButton.qml
        qml/components/GhostButton.qml
        qml/components/StatusPill.qml
        qml/components/CreditMeter.qml
        qml/components/FieldInput.qml
        qml/components/LogoMark.qml
        qml/components/PlanCard.qml
        qml/components/SectionLabel.qml
        qml/components/Toast.qml
        qml/components/ModalBase.qml
        qml/components/DecartViewport.qml
        qml/components/ToggleSwitch.qml
        qml/components/IconBarButton.qml
        qml/components/PresetChip.qml
        qml/components/CryptoPayPanel.qml
        qml/components/ResponsiveHelper.qml
        qml/components/ScanlinesOverlay.qml
        qml/components/GateBlocker.qml
        qml/components/MaintenanceBlocker.qml
        qml/screens/PreloaderScreen.qml
        qml/screens/AuthScreen.qml
        qml/screens/AccessGateScreen.qml
        qml/screens/DashboardScreen.qml
        qml/screens/DownloadsScreen.qml
        qml/screens/SettingsScreen.qml
        qml/modals/AccountModal.qml
        qml/modals/PlanGateModal.qml
        qml/modals/PayModal.qml
        qml/modals/ConsentModal.qml
        qml/modals/WelcomeModal.qml
        qml/modals/FreeCreditsModal.qml
        qml/modals/LockScreen.qml
        qml/modals/AdminModal.qml
        qml/modals/TutorialsModal.qml
        qml/modals/TourOverlay.qml
        qml/modals/BackgroundPanel.qml
        qml/modals/AbuseReportModal.qml
        qml/modals/UpgradeModal.qml
        qml/modals/NotificationModal.qml
        qml/modals/CryptoProofModal.qml
        qml/modals/PaymentStatusModal.qml
        qml/modals/ExpiryModal.qml
        qml/modals/StreamConsentModal.qml
        qml/modals/ForceUpdateModal.qml
        qml/modals/OnboardingOverlay.qml
        qml/modals/GetStartedModal.qml
        qml/modals/PaySuccessModal.qml
        qml/modals/StarterPayModal.qml
        qml/modals/StarterLockScreen.qml
    RESOURCES
        icons/icon.png
        qml/assets/auth-streamer-v1.jpg
)

# ── Bundled fonts (Inter UI + JetBrains Mono) — match the Electron theme ─
qt_add_resources(LiveEscape "fonts"
    PREFIX "/fonts"
    BASE "fonts"
    FILES
        fonts/Inter-Variable.ttf
        fonts/Rajdhani-Regular.ttf
        fonts/Rajdhani-Medium.ttf
        fonts/Rajdhani-SemiBold.ttf
        fonts/Rajdhani-Bold.ttf
        fonts/JetBrainsMono-Variable.ttf
)

target_include_directories(LiveEscape PRIVATE src)

target_link_libraries(LiveEscape PRIVATE
    Qt6::Core Qt6::Gui Qt6::Widgets Qt6::Quick
    Qt6::QuickControls2 Qt6::Network Qt6::Multimedia
    GstRtcPeer
    StreamServer
    CommonI18n
)

if(SS_HAS_WS)
    target_link_libraries(LiveEscape PRIVATE Qt6::WebSockets)
    target_compile_definitions(LiveEscape PRIVATE QT_WEBSOCKETS_LIB=1)
endif()

# ── i18n: English-only .ts for lupdate scanning + embedded catalog ─────
set(LIVEESCAPE_TS_FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/i18n/liveescape_en.ts
)
if(TARGET Qt6::lupdate)
    qt_add_translations(LiveEscape
        TS_FILES ${LIVEESCAPE_TS_FILES}
        RESOURCE_PREFIX "/i18n"
        LUPDATE_OPTIONS -compress
    )
    message(STATUS "Qt LinguistTools: qt_add_translations enabled (English catalog only)")
else()
    message(WARNING "Qt LinguistTools not found — online translation will still work")
endif()

# Embed English .ts as resource for runtime string catalog parsing
qt_add_resources(LiveEscape "i18n_catalog"
    PREFIX "/i18n"
    FILES i18n/liveescape_en.ts
    BASE "i18n"
)

if(WIN32)
    set_target_properties(LiveEscape PROPERTIES WIN32_EXECUTABLE TRUE)
elseif(APPLE)
    find_library(IOKIT_LIBRARY IOKit REQUIRED)
    find_library(COREFOUNDATION_LIBRARY CoreFoundation REQUIRED)
    target_link_libraries(LiveEscape PRIVATE ${IOKIT_LIBRARY} ${COREFOUNDATION_LIBRARY})
    set_target_properties(LiveEscape PROPERTIES
        MACOSX_BUNDLE TRUE
        MACOSX_BUNDLE_BUNDLE_NAME "Live Escape"
        MACOSX_BUNDLE_GUI_IDENTIFIER "com.jaytech.liveescape"
        MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
        MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION}
    )
endif()

install(TARGETS LiveEscape BUNDLE DESTINATION . RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})

# Smoke tests — run with `make test` / `ctest`
if(BUILD_TESTING)
    find_package(Qt6 REQUIRED COMPONENTS Test)
    add_executable(LiveEscape_smoke_test tests/smoke.cpp src/core/SecureStore.cpp)
    target_link_libraries(LiveEscape_smoke_test PRIVATE
        Qt6::Core Qt6::Gui Qt6::Test)
    target_include_directories(LiveEscape_smoke_test PRIVATE src)
    add_test(NAME le_smoke COMMAND LiveEscape_smoke_test)
    set_tests_properties(le_smoke PROPERTIES ENVIRONMENT "QT_QPA_PLATFORM=offscreen")
endif()
