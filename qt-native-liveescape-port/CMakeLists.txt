cmake_minimum_required(VERSION 3.22)
project(SmokeScreen VERSION 1.8.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

find_package(Qt6 6.8 REQUIRED COMPONENTS
    Core Gui Widgets Quick QuickControls2 Network Multimedia
)
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

# Shared native libraries (GStreamer WebRTC peer, MJPEG OBS server, i18n)
add_subdirectory(../apps/common/gstpeer ${CMAKE_BINARY_DIR}/_gstpeer)
add_subdirectory(../apps/common/streamserver ${CMAKE_BINARY_DIR}/_streamserver)
add_subdirectory(../apps/common/i18n ${CMAKE_BINARY_DIR}/_i18n)

set(SS_SOURCES
    src/main.cpp
    src/core/MachineIdProvider.cpp   src/core/MachineIdProvider.h
    src/core/ApiClient.cpp           src/core/ApiClient.h
    src/core/SecureStore.cpp         src/core/SecureStore.h
    src/core/SessionManager.cpp      src/core/SessionManager.h
    src/core/AppController.cpp       src/core/AppController.h
    src/core/UpdateChecker.cpp       src/core/UpdateChecker.h
    src/core/StreamController.cpp    src/core/StreamController.h
    src/core/WebSocketClient.cpp
    src/core/DecartSignalingClient.cpp src/core/DecartSignalingClient.h
)

qt_add_executable(smokescreen-qt ${SS_SOURCES})

set_source_files_properties(qml/theme/Theme.qml PROPERTIES QT_QML_SINGLETON_TYPE TRUE)

qt_add_qml_module(smokescreen-qt
    URI SmokeScreen
    VERSION 1.0
    QML_FILES
        qml/Main.qml
        qml/theme/Theme.qml
        qml/components/ModalBase.qml
        qml/components/Toast.qml
        qml/components/GateBlocker.qml
        qml/components/CryptoPayPanel.qml
        qml/modals/ConsentModal.qml
        qml/modals/WelcomeModal.qml
        qml/modals/FreeCreditsModal.qml
        qml/modals/ExpiryModal.qml
        qml/modals/LockScreen.qml
        qml/modals/PaySuccessModal.qml
        qml/modals/StreamConsentModal.qml
        qml/modals/AbuseReportModal.qml
        qml/modals/NotificationModal.qml
        qml/modals/ForceUpdateModal.qml
        qml/modals/PlanGateModal.qml
        qml/modals/PayModal.qml
        qml/modals/AccountModal.qml
        qml/modals/GetStartedModal.qml
        qml/modals/StarterLockScreen.qml
        qml/modals/StarterPayModal.qml
        qml/modals/UpgradeModal.qml
        qml/modals/AdminModal.qml
        qml/modals/BackgroundPanel.qml
        qml/modals/PaymentStatusModal.qml
        qml/modals/TourOverlay.qml
        qml/modals/TutorialsModal.qml
        qml/modals/OnboardingOverlay.qml
        qml/screens/PreloaderScreen.qml
        qml/screens/AuthScreen.qml
        qml/screens/AccessGateScreen.qml
        qml/components/StageViewport.qml
        qml/screens/DashboardScreen.qml
)

# Bundled fonts — Maple Mono NF is the single app font.
qt_add_resources(smokescreen-qt "fonts"
    PREFIX "/fonts"
    BASE "resources/fonts"
    FILES
        resources/fonts/MapleMono-NF-Regular.ttf
        resources/fonts/MapleMono-NF-Medium.ttf
        resources/fonts/MapleMono-NF-SemiBold.ttf
        resources/fonts/MapleMono-NF-Bold.ttf
)

target_include_directories(smokescreen-qt PRIVATE src)

target_link_libraries(smokescreen-qt PRIVATE
    Qt6::Core Qt6::Gui Qt6::Widgets Qt6::Quick
    Qt6::QuickControls2 Qt6::Network Qt6::Multimedia
    GstRtcPeer
    StreamServer
    CommonI18n
)

if(SS_HAS_WS)
    target_link_libraries(smokescreen-qt PRIVATE Qt6::WebSockets)
    target_compile_definitions(smokescreen-qt PRIVATE QT_WEBSOCKETS_LIB=1)
endif()
