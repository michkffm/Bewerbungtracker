# Bewerbungstracker

Eine kleine Web-App, um Bewerbungen an einem Ort zu sammeln und ihren Status im Blick zu behalten. Die Daten bleiben im Browser – ohne Konto, Backend oder Datenbank.

**HTML · CSS · JavaScript · localStorage**

![Bewerbungstracker mit Formular und Bewerbungsübersicht](docs/screenshot.png)

## Funktionen

- Bewerbungen mit Unternehmen, Position, Datum, Status und optionalem Link erfassen.
- Vorhandene Einträge zum Bearbeiten in das Formular übernehmen.
- Zwischen Hell- und Dunkelmodus wechseln.
- Bewerbungen und Farbschema im `localStorage` des Browsers speichern.

## Lokal starten

```bash
git clone https://github.com/michkffm/Bewerbungtracker.git
cd Bewerbungtracker
```

Anschließend `index.html` im Browser öffnen. Es sind keine Paketinstallation und kein Build erforderlich. Alternativ mit installiertem Python:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Dann [localhost:8000](http://localhost:8000) öffnen. Die Adresse sollte gleich bleiben, damit der Browser auf denselben lokalen Speicher zugreift.

## Aufbau und technische Schwerpunkte

| Datei | Aufgabe |
| --- | --- |
| `index.html` | Formular und Bewerbungstabelle |
| `style.css` | Darstellung und Farbmodi |
| `script.js` | Formularereignisse, Tabellenaufbau und lokaler Speicher |

Das Projekt zeigt DOM-Manipulation, Ereignisbehandlung und das Speichern strukturierter Daten als JSON. Autor laut Quelltext: Michael Koch.

## Aktueller Stand

Die Oberfläche wurde am 21. Oktober 2026 lokal geöffnet; der Screenshot zeigt den unveränderten leeren Startzustand. Eine öffentliche Live-Demo ist nicht verifiziert.

- Die Löschfunktion ist angelegt, scheitert derzeit aber an der Neuzuweisung einer mit `const` deklarierten Liste.
- Es gibt keine Synchronisation und keinen Export. Gelöschte Browserdaten entfernen auch die gespeicherten Bewerbungen.
- Formular und Tabelle mischen deutsche und englische Beschriftungen.
- Eine automatisierte Testsuite ist nicht vorhanden. Externe Stellenlinks sind vor einem produktiven Einsatz auf erlaubte URL-Protokolle zu begrenzen.

## Lizenz und Kontakt

Die bisherige Projektbeschreibung und der Quelltext nennen MIT; eine separate `LICENSE`-Datei ist im Repository derzeit nicht enthalten.

[Michael Koch auf GitHub](https://github.com/michkffm) · [Interaktives Portfolio](https://michael-koch-portfolio.onrender.com/)
