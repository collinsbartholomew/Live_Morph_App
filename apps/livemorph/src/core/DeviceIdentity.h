#pragma once

#include <QString>

/**
 * Stable per-install machine id for license binding and API identity.
 * Prefer OS machineUniqueId; otherwise persist a UUID in SecureStore.
 */
class DeviceIdentity
{
public:
    /// Non-empty stable id (hex / uuid-like). Safe for headers.
    static QString deviceId();
    static QString appVersion();
    static QString userAgent();
};
