find_package(Qt6 REQUIRED COMPONENTS Core Network Gui)

add_library(StreamServer STATIC StreamServer.cpp StreamServer.h)
target_include_directories(StreamServer PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(StreamServer PUBLIC
    Qt6::Core
    Qt6::Gui
    Qt6::Network
)