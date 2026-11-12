find_package(PkgConfig REQUIRED)
pkg_check_modules(GST REQUIRED
    gstreamer-1.0
    gstreamer-webrtc-1.0
    gstreamer-sdp-1.0
    gstreamer-app-1.0
    gstreamer-video-1.0
)

add_library(GstRtcPeer STATIC GstRtcPeer.cpp GstRtcPeer.h)
target_include_directories(GstRtcPeer PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_compile_definitions(GstRtcPeer PUBLIC GST_USE_UNSTABLE_API=1)
target_link_libraries(GstRtcPeer PUBLIC
    Qt6::Core Qt6::Multimedia Qt6::Network
    ${GST_LIBRARIES}
)
target_include_directories(GstRtcPeer PUBLIC ${GST_INCLUDE_DIRS})
target_link_directories(GstRtcPeer PRIVATE ${GST_LIBRARY_DIRS})
