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

qt_add_qml_module(LiveEscape
    URI LiveEscape
    VERSION 1.0
    QML_FILES
        qml/Main.qml
        qml/theme/Theme.qml
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
        qml/screens/PreloaderScreen.qml
        qml/screens/AuthScreen.qml
        qml/screens/AccessGateScreen.qml
        qml/screens/DashboardScreen.qml
        qml/modals/AccountModal.qml
        qml/modals/PlanGateModal.qml
        qml/modals/PayModal.qml
        qml/modals/ConsentModal.qml
        qml/modals/WelcomeModal.qml
        qml/modals/FreeCreditsModal.qml
        qml/modals/LockScreen.qml
        qml/modals/AdminModal.qml
        qml/modals/CheckoutWebModal.qml
        qml/modals/TutorialsModal.qml
        qml/modals/TourOverlay.qml
        qml/modals/BackgroundPanel.qml
        qml/modals/AbuseReportModal.qml
        qml/modals/UpgradeModal.qml
        qml/modals/NotificationModal.qml
        qml/modals/CryptoProofModal.qml
        qml/modals/PaymentStatusModal.qml
    RESOURCES
        icons/icon.png
)

target_include_directories(LiveEscape PRIVATE src)

target_link_libraries(LiveEscape PRIVATE
    Qt6::Core Qt6::Gui Qt6::Widgets Qt6::Quick
    Qt6::QuickControls2 Qt6::Network Qt6::Multimedia
    GstRtcPeer
)

if(SS_HAS_WS)
    target_link_libraries(LiveEscape PRIVATE Qt6::WebSockets)
    target_compile_definitions(LiveEscape PRIVATE QT_WEBSOCKETS_LIB=1)
endif()

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
