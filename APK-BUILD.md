# QuranCall — APK banane ka tarika (2 minute)

App PWA-ready hai. APK banane ke 2 sabse asaan tarike:

## Option A — PWABuilder (recommended, no install)

1. App ko **publish** karo: top-right **Publish** button → live URL milega
   (jaise `https://devotional-reads.lovable.app`).
2. Browser mein kholo: **https://www.pwabuilder.com**
3. Apna live URL paste karo → **Start**.
4. **Android** card pe → **Generate Package**.
5. Package type:
   - **Signed APK / AAB** — Play Store ke liye (PWABuilder khud sign kar deta hai,
     ya apna keystore upload karo).
   - **Test-only APK** — sirf phone pe install karke test karne ke liye.
6. ZIP download → andar `.apk` file → phone pe transfer → install.

Ye Trusted Web Activity (TWA) banata hai — full-screen app, address bar nahi
dikhega, splash screen bhi apne aap ban jayega.

### Address bar hataana (Digital Asset Links)

PWABuilder ZIP mein ek `assetlinks.json` hoga. Us file ka content copy karke
project mein daalo:

- File path: `public/.well-known/assetlinks.json`
- Publish karo (frontend change → **Update** dabao publish dialog mein).

Phir Android app kholne pe URL bar chhup jayega.

## Option B — Bubblewrap (Google's CLI)

Agar Node CLI comfort hai:

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest=https://devotional-reads.lovable.app/manifest.webmanifest
bubblewrap build
```

`app-release-signed.apk` output milega.

---

### Zaruri baatein

- **Mic / camera / screen share** APK mein bhi chalega — TWA browser permissions
  inherit karta hai.
- Pehli baar app khulne pe Android **microphone permission** maangega — Allow.
- Push notifications ke liye alag Firebase setup chahiye (abhi nahi kiya).
