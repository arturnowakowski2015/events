package com.eventsRegistry.model;

public class dates {
/*
 * 
1) BR-001: Centralne tworzenie i zarządzanie zdarzeniami

	•  Opis: Umożliwi użytkownikom tworzenie, edytowanie i przeglądanie zdarzeń (eventów) 
	z metadanymi: tytuł, data/godzina, lokalizacja, typ zdarzenia, status, tagi, opis i załączniki.
	•  Wartość biznesowa: Standaryzacja rejestracji zdarzeń, szybsze wprowadzanie i lepsza jakość danych.
	•  Interesariusze: operatorzy rejestru, analitycy, menedżerowie.
	•  Kryteria akceptacji:
	•  Można utworzyć zdarzenie z obowiązkowymi polami (co najmniej: typ, data, lokalizacja).
	•  Można edytować i zapisać zmiany; system zapisuje autora i czas modyfikacji.
	•  Można dodać załączniki (zdjęcie, PDF) i wyświetlić je przy zdarzeniu.
	•  UI/UX pozwala na listę i podgląd pojedynczego zdarzenia.
	•  Priorytet: Wysoki.

2) BR-002: Zarządzanie uczestnikami i rolami

	•  Opis: Rejestr uczestników (participant registry), przypisywanie ról w kontekście zdarzenia (np. Perpetrator, Victim, Witness, Officer), deduplikacja na podstawie unikalnego identyfikatora (personalId).
	•  Wartość biznesowa: Spójność informacji o osobach, możliwość śledzenia powiązań między wieloma zdarzeniami.
	•  Interesariusze: detektywi/śledczy, operatorzy, analitycy.
	•  Kryteria akceptacji:
	•  Można dodać uczestnika z danymi podstawowymi (imię, nazwisko, personalId, kontakt).
	•  System wykrywa i proponuje złączenie (merge) gdy personalId się powtarza.
	•  Można przypisać jednemu uczestnikowi wiele ról w różnych zdarzeniach oraz zmieniać role.
	•  API pozwala pobrać listę zdarzeń powiązanych z danym uczestnikiem.
	•  Priorytet: Wysoki.

3) BR-003: Formularze raportowania incydentów i workflow zatwierdzania

	•  Opis: Strukturalne formularze (szablony) do zgłaszania incydentów z wymuszeniem pól obowiązkowych, walidacją oraz procesem przeglądu/zaakceptowania przez nadzór.
	•  Wartość biznesowa: Lepsza jakość danych, kontrola procesu zgłaszania, śledzenie statusu zgłoszenia.
	•  Interesariusze: użytkownicy zgłaszający, przełożeni, compliance.
	•  Kryteria akceptacji:
	•  Możliwość wyboru szablonu formularza podczas tworzenia zdarzenia.
	•  System waliduje wymagane pola przed zatwierdzeniem.
	•  Zgłoszenie może trafić do przeglądu; zmiana statusu (Draft → Submitted → Reviewed → Closed) jest rejestrowana.
	•  Powiadomienia dla osób odpowiedzialnych za zatwierdzenie.
	•  Priorytet: Średnio-wysoki.

4) BR-004: Wyszukiwanie i filtrowanie (advanced search)

	•  Opis: Zaawansowane wyszukiwanie po wielu kryteriach (data, lokalizacja, typ, rola uczestnika, tagi, słowa kluczowe) z możliwością zapisywania zapytań.
	•  Wartość biznesowa: Szybkie znajdowanie powiązanych zdarzeń, wsparcie analizy i dochodzeń.
	•  Interesariusze: analitycy, śledczy.
	•  Kryteria akceptacji:
	•  Użytkownik może filtrować listę zdarzeń po co najmniej 6 kryteriach naraz.
	•  Wyniki paginowane; wyszukiwanie pełnotekstowe (opis, tagi) działa.
	•  Możliwość zapisania i przywrócenia zapytania.
	•  Priorytet: Wysoki.

5) BR-005: Powiadomienia, subskrypcje i alerty

	•  Opis: Umożliwi subskrypcję typów zdarzeń, obszarów geograficznych lub konkretnych uczestników; wysyłanie alertów (e-mail/push/SMS) przy spełnieniu reguły (np. poważne incydenty, nowe zdarzenie w okolicy).
	•  Wartość biznesowa: Szybka reakcja, lepsze monitorowanie krytycznych zdarzeń.
	•  Interesariusze: służby reagowania, managerowie.
	•  Kryteria akceptacji:
	•  Użytkownik może zdefiniować regułę subskrypcji (np. typ=„kradzież” AND radius=5km).
	•  System wysyła testowe powiadomienie i rzeczywiste powiadomienia przy spełnieniu warunków.
	•  Historia wysłanych alertów dostępna w UI.
	•  Priorytet: Średni.

6) BR-006: Audyt i wersjonowanie zdarzeń

	•  Opis: Pełny audyt wszystkich zmian (kto, kiedy, co zmienił) oraz możliwość przywrócenia poprzedniej wersji zdarzenia.
	•  Wartość biznesowa: Zgodność z regulacjami, śledzenie działań operatorów, bezpieczeństwo dowodowe.
	•  Interesariusze: compliance, audyt, prawne.
	•  Kryteria akceptacji:
	•  Wszystkie zmiany są zapisywane w logu z danymi użytkownika i znacznikiem czasu.
	•  Można zobaczyć diff między wersjami i przywrócić starszą wersję.
	•  Dostęp do audytu wymaga uprawnień (role).
	•  Priorytet: Wysoki (w organizacjach regulowanych).

7) BR-007: Ochrona danych osobowych i zarządzanie zgodami (PII & Consent)

	•  Opis: Mechanizmy maskowania/anonimizacji danych osobowych, rejestr zgód i możliwość obsługi żądań usunięcia/eksportu danych (RODO/GDPR).
	•  Wartość biznesowa: Zgodność prawna, zmniejszenie ryzyka prawnego.
	•  Interesariusze: Dział prawny, bezpieczeństwo, użytkownicy.
	•  Kryteria akceptacji:
	•  System przechowuje status zgód powiązanych z uczestnikami.
	•  Można zanonimizować/ukryć PII na żądanie oraz wygenerować pełny eksport danych dla osoby.
	•  Maskowanie jest widoczne w UI dla ról bez uprawnień.
	•  Priorytet: Wysoki (jeżeli system przechowuje PII).

8) BR-008: Dashboardy analityczne i raportowanie

	•  Opis: Interaktywne dashboardy (trendy, heatmapy, KPI) oraz możliwość generowania raportów PDF/CSV dla okresów i kategorii.
	•  Wartość biznesowa: Szybkie insighty operacyjne, wsparcie decyzji strategicznych.
	•  Interesariusze: kierownictwo, analitycy.
	•  Kryteria akceptacji:
	•  Dostępne co najmniej 3 predefiniowane dashboardy (np. liczba zdarzeń/miesiąc, typy zdarzeń, mapa skupień).
	•  Eksport danych do CSV/PDF z możliwością wyboru zakresu dat i filtrów.
	•  Priorytet: Średni.

9) BR-009: Lokalizacja i mapa (geolokalizacja)

	•  Opis: Mapowe przedstawienie zdarzeń z możliwością klastrowania, wyszukiwania po rejonie, rysowania obszarów zainteresowania i alertów geograficznych.
	•  Wartość biznesowa: Wizualne rozpoznanie hotspotów, szybsze planowanie działań terenowych.
	•  Interesariusze: zespoły terenowe, analitycy.
	•  Kryteria akceptacji:
	•  Zdarzenia wyświetlają się na mapie z ikonami według typu/statusu.
	•  Użytkownik może zaznaczyć obszar (polygon) i zapisać alert/subskrypcję dla tego obszaru.
	•  Mapy reagują na filtrację listy zdarzeń.
	•  Priorytet: Średni.

10) BR-010: Integracje i API (import/eksport/webhooks)

	•  Opis: Publiczne/zastrzeżone API do tworzenia, pobierania i aktualizowania zdarzeń; webhooki dla powiadomień; import CSV; konektory do systemów zewnętrznych (np. bazy policyjne, CRM).
	•  Wartość biznesowa: Automatyzacja przepływów, integracja z istniejącą infrastrukturą.
	•  Interesariusze: integratorzy IT, partnerzy zewnętrzni.
	•  Kryteria akceptacji:
	•  CRUD API udokumentowane OpenAPI; autoryzowane (token/SSO).
	•  Możliwość skonfigurowania webhooka, który dostaje payload przy utworzeniu/aktualizacji zdarzenia.
	•  Import CSV z walidacją i raportem błędów.
	•  Priorytet: Wysoki (dla integracji enterprise).

11) BR-011: Bezpieczeństwo i kontrola dostępu (RBAC / SSO)

	•  Opis: Role-based access control, integracja z SSO/LDAP, szyfrowanie PII w spoczynku i w tranzycie.
	•  Wartość biznesowa: Ochrona danych, zgodność polityk bezpieczeństwa.
	•  Interesariusze: dział bezpieczeństwa, administratorzy.
	•  Kryteria akceptacji:
	•  Możliwość zdefiniowania ról i przypisania uprawnień do akcji (create/edit/delete/view/audit/export).
	•  Logowanie przez SSO (jeśli dostępne).
	•  Dane wrażliwe szyfrowane i dostępne tylko dla ról mających uprawnienia.
	•  Priorytet: Krytyczny/konieczny w środowisku produkcyjnym.

 * 
 */
}
