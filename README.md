Knihobot testovací úkol

V tomto projektu jsem implementoval dva endpointy podle zadání:

1. Mock externí cenové API (/mock-price)
   - Vrací deterministickou cenu na základě ISBN (ISBN-10 nebo ISBN-13, s pomlčkami i bez), nebo 404 pro cca 50 % ISBN.
   - Cena je vždy stejná pro stejné ISBN, pro ISBN-10 i ISBN-13 je výsledek stejný.

2. Přidání položky (/books)
   - Validuje ISBN (10/13, s pomlčkami i bez), vypočítá obě varianty.
   - Získá cenu z mock-price, vynásobí koeficientem podle condition.
   - Získá název knihy z OpenLibrary.
   - Pokud je cena i název, vrací 200 a data, jinak 202 a data.

Přidal jsem Dockerfile pro snadné nasazení na Render nebo jiný cloud. Projekt lze spustit v Dockeru, build i běh jsou optimalizované pro produkci.

Dále jsem přidal základní GitHub Actions workflow, které pouze ověřuje build a testy (akce je pouze demonstrační, protože bez serveru nemá smysl nasazovat automaticky).

Všechny hlavní části jsou pokryté testy (unit i integrační), včetně edge-case scénářů a validace.

Seznam hlavních kroků:
- Implementace endpointů podle zadání
- Validace a konverze ISBN
- Deterministická logika ceny a 50% pravděpodobnost 404
- Integrace s OpenLibrary
- Dockerfile a .dockerignore
- CI/CD workflow (build, test, docker build)
- Pokrytí testy

