cmake_minimum_required(VERSION 3.22)
project(CommonI18n LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt6 6.5 REQUIRED COMPONENTS Core Qml)

add_library(CommonI18n STATIC
    I18nManager.cpp
    I18nManager.h
)

target_include_directories(CommonI18n PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

target_link_libraries(CommonI18n PUBLIC
    Qt6::Core
    Qt6::Qml
)
