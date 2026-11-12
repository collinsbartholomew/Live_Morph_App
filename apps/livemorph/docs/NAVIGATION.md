# Navigation & event flows

## Pages (App.currentPage)

| Page | Auth required | Entry |
|------|---------------|--------|
| `auth` | no | launch, sign-out |
| `dashboard` | yes | sign-in, Back from settings/credits |
| `settings` | yes | TopBar / App.openSettings |
| `buy-credits` | yes | TopBar / insufficient credits / App.openBuyCredits |

Guards in `AppController::setCurrentPage`:
- Unauthenticated → cannot open dashboard/settings/buy-credits
- Authenticated → cannot stay on auth

## Overlays (Dashboard)

| UI | Open | Close |
|----|------|-------|
| HelpDrawer | TopBar Help / App.helpRequested | Esc, drawer close |
| NotificationsPanel | TopBar bell | Esc, toggle |
| WhatsNewModal | first version / Settings | Esc, Got it |
| OnboardingTour | first launch | Esc / finish |
| PreviewWindow | Ctrl+P / App.openPreview | window close |
| PopoutWindow | Ctrl+Shift+P | window close |
| ToastHost | App.notification, errors | auto |

## Backend scenarios

| Event | Behavior |
|-------|----------|
| Backend offline | toast warning; payment create blocked |
| Sign-in success | → dashboard + toast |
| Sign-out | stop morph session → auth |
| OTP / auth error | toast via Auth.errorMessage |
| Start morph, no credits | error + open buy-credits |
| Start morph, not signed in | error + auth |
| Payment order created | open Paystack URL; recheck verifies |
| Tokens provisioned | success toast; balance refresh |
| Session error | toast error |
| F12 recording | startRecording / stopRecording |

## Quit

App.quitApp stops active morph session then exits.
