# tuubaa twitch bot

### Mach das nur wenn du weißt was du tust!!!!!!


## Prerequisites

Before you can run this bot, make sure you have:

- [Node.js](https://nodejs.org/) installieren (version 18 oder neuer)
- [npm](https://www.npmjs.com/get-npm) oder jeder andere package manager


## Bauen

Um den bot zu bauen musst du erstmal credentials in deiner .env eingeben.
Welche das sind siehst du in der [Template](.env.template)
Die OAuth URL die du brauchen wirst ist auch in der Template aber hier auch:

```sh
https://id.twitch.tv/oauth2/authorize?response_type=token&client_id={token}&redirect_uri={fallbackurl}&scope=analytics:read:extensions+analytics:read:games+bits:read+channel:edit:commercial+channel:manage:broadcast+channel:manage:extensions+channel:manage:moderators+channel:manage:polls+channel:manage:predictions+channel:manage:raids+channel:manage:redemptions+channel:manage:schedule+channel:manage:videos+channel:read:editors+channel:read:goals+channel:read:hype_train+channel:read:polls+channel:read:predictions+channel:read:redemptions+channel:read:stream_key+channel:read:subscriptions+channel:read:vips+channel:manage:vips+moderator:manage:banned_users+moderator:read:blocked_terms+moderator:manage:blocked_terms+moderator:manage:automod+moderator:read:automod_settings+moderator:manage:automod_settings+moderator:read:chat_settings+moderator:manage:chat_settings+moderator:read:chatters+moderator:read:followers+moderator:read:guest_star+moderator:manage:guest_star+moderator:read:shield_mode+moderator:manage:shield_mode+moderator:read:shoutouts+moderator:manage:shoutouts+channel:moderate+chat:edit+chat:read+whispers:read+whispers:edit+user:edit+user:edit:follows+user:manage:blocked_users+user:read:blocked_users+user:read:broadcast+user:read:email+user:read:follows+user:read:subscriptions+clips:edit+moderation:read+channel:bot&state=c3ab8aa609ea11e793ae92361f002671
```

Um deinen Client Token und deine Fallbackurl zu bekommen gehe auf **https://dev.twitch.tv/**.
Dort kannst du alles deine Fallbackurl einstellen und dein Client token bekommen!

Nachdem du alles in der .env eingeben hast gibt es mehrer modis in dem du den Bot starten kannst:

## Developer Modis:

### Static Dev
```sh
npm run dev
```
Mit static dev wird dein aktueller code genommen und der bot wird damit gestartet aber es wird nichts live geupdatet.

### Live Dev
```sh
npm run live
```
Mit Live Dev kannst du deinen Bot starten und alle änderungen werden live geupdatet

## Production

### Bauen
```sh
npm run build
```
Erstmal baust du deinen Code und compilest in in Javascript

### Starten
```sh
npm run start
```
Dann startest du den bot in Production


## Docker Container

Es gibt auch eine [DOCKERFILE](DOCKERFILE)!
Das einzige was du brauchst ist das Docker installiert ist und der Docker Deamon.

Dann kannst du diesen Command eingeben:

```sh
docker container up -d
```
Damit startet dein Container!


## TOKEN

Damit man alle Commands benutzten kann muss man sich einmal mit dem bot authentifizieren.
Um das ohne eine datenbank zu machen wird eine tokens.json file erstellt wo dann die User tokens gespeichert werden.

Starte den bot und benutzt !tokens (Am besten wenn du NICHT streamst)
Dann kommt sowieso ein Guide

Wenn du es mannuel machst (WAS ICH STARK EMPFEHLE)
machst du nachem du dich authentifierzt hast und deinen token aus der URL rausgenommen hast anstatt den token dort einzugeben gibs du den command so ein:

```sh
!token {leerzeichen}
```

Der Bot erstellt dann die tokens.json file und die sieht dann so aus:

```json
{
      "1tuubaa": {
    "access_token": ""
  }
}
```

Im leerzeichen zwischen den Klammer: "", machst du dann das token rein und so sollte es dann aussehen.

```json
{
      "1tuubaa": {
    "access_token": "abrwe23313213"
  }
}
```

## Lizenz

Diese Projekt ist unter einer MIT Lizenz lizenziert. Mehr infos in der [LICENSE](LICENSE).


## Hilfe
Falls du Hilfe brauchst kannst du mich gerne auf Discord Kontaktieren oder ein Issue öffnen !