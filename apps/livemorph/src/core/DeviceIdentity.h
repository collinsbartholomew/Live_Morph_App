#pragma once

#include <QString>

#ifndef LIVEMORPH_APP_VERSION
#define LIVEMORPH_APP_VERSION "1.0.0"
#endif

/**
 * Stable per-install machine id for license binding and API identity.
 * Prefer OS machineUniqueId; otherwise persist a UUID in SecureStore.
 */
class DeviceIdentity
{
public:
    /// Single source for the app version string (presentation-owned, not logic).
    /// Baked in from CMake's project() version at build time.
    inline static const QString APP_VERSION = QStringLiteral(LIVEMORPH_APP_VERSION);

    /// Non-empty stable id (hex / uuid-like). Safe for headers.
    static QString deviceId();
    static QString appVersion();
    static QString userAgent();
};
