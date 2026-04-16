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

	•  Opis: Rejestr uczestników (participant registry), przypisywanie ról w kontekście zdarzenia (np. Perpetrator, Victim, Witness, Officer),
	 deduplikacja na podstawie unikalnego identyfikatora (personalId).
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
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * Kiedy w systemie dodajesz lub aktualizujesz uczestnika z polem personalId (unikalny identyfikator osoby), system wyszukuje już istniejące rekordy z tym samym personalId.
	•  Jeśli znajduje ≥1 istniejący rekord z takim personalId, zamiast automatycznie tworzyć duplikat, system „proponuje złączenie” — czyli wskazuje użytkownikowi, że znaleziono potencjalny duplikat i pyta, czy:
	•  Połączyć dane w jeden rekord (merge),
	•  Zachować oba (odrzucić propozycję),
	•  Albo zaktualizować istniejący rekord.
	•  Propozycja powinna być widoczna w UI (np. modal/okno porównania) z możliwością wyboru, które pola zachować, oraz powinna generować audit log.

2) Co potrzeba w architekturze / komponentach

	•  Indeks lub zapytanie szybkiego wyszukiwania po personalId (np. DB index, search index).
	•  Serwis backendowy wyzwalający sprawdzenie przy create/update (synchronnie lub asynchronicznie).
	•  Endpointy do: wyszukiwania sugestii, wykonania merge, cofnięcia/archiwizacji.
	•  UI: formularz dodawania/edycji, ekran porównania rekordów, przyciski „merge / ignore”.
	•  Audyt i historia (kto/ kiedy/ które pola zostały zmienione).
	•  Transakcja/atomowość operacji merge (zachowanie referencji — eventy/role uczestnika powinny wskazywać na wynikowy rekord).

3) Proponowany przepływ (UX) — krok po kroku

	•  Użytkownik wypełnia formularz tworzenia uczestnika i wpisuje personalId.
	•  Przed zapisem system wywołuje backend: „czy są pasujące rekordy?”.
	•  Jeśli znajdzie dopasowania → pokaż listę podglądów z przyciskiem „Porównaj / Połącz”.
	•  W widoku porównania pokaż oba rekordy side-by-side, pola różnic, powiązane role/zdarzenia.
	•  Użytkownik wybiera: master record (który zachowa identyfikator), pola do przepisania (albo regułę typu preferuj niepuste), oraz wersję audytu.
	•  Po zatwierdzeniu system wykona operację merge w transakcji: zaktualizuje rekord docelowy, przeniesie wszystkie powiązania (role, udział w zdarzeniach) z rekordu źródłowego na docelowy, oznaczy/usuwa rekord źródłowy (soft-delete lub link do historycznego id), zapisze audit entry.
	•  Powiadomienie/log, możliwość cofnięcia w określonym oknie (jeśli polityka wymaga).

4) Przykładowe API (REST) — minimalny zestaw

	•  GET /participants?suggestByPersonalId={id}
	•  Zwraca potencjalne dopasowania i stopień zgodności.
	•  POST /participants
	•  Tworzy uczestnika; jeśli sugestie istnieją, zwraca status 409 z payloadem suggestions (możesz też zwrócić 200 + suggestions w body i pozostawić wybór).
	•  POST /participants/{targetId}/merge
	•  Body: { "sourceIds": [..], "mergeStrategy": "preferNonNull" | "preferNew" | "custom", "fieldResolution": { "phone": "source", "address": "target" } }
	•  Zwraca: mergedRecord + auditId
	•  GET /participants/{id}/audit
	•  Zawiera zapis czym i kiedy połączono (kto).

Przykładowy payload dla merge: { "sourceIds": ["uuid-2"], "mergeStrategy": "preferNonNull", "fieldResolution": { "phone": "source", "email": "target" }, "performedBy": "operatorId" }

5) Prosty algorytm wykrywania i pseudokod merge

	•  Wykrywanie: exact match on personalId
	•  SELECT * FROM participants WHERE personal_id = :personalId;
	•  Dodatkowo: fallback fuzzy matching (name + birthdate + phone) dla brakującego/niepewnego personalId.
	•  Pseudokod merge (transakcyjnie): begin transaction target = load(targetId) for each sourceId in sourceIds: source = load(sourceId) for each relation in source.relations: relation.participantId = target.id save(relation) for each field in participant_fields: target.field = resolveField(target.field, source.field, strategy, fieldResolution) mark source as merged_into = target.id (soft-delete or set status=MERGED) save(target) createAuditEntry(...) commit

Funkcja resolveField przykład:

	•  if fieldResolution has explicit rule -> apply it
	•  else if strategy == preferNonNull -> target = target != null ? target : source
	•  else preferNew -> target = source (overwrite)
	•  else keep target -> do nothing

6) Modele danych / co trzeba zachować

	•  Participant { id, personalId, firstName, lastName, birthDate, phone, email, address, status, canonicalId? }
	•  ParticipantRole { id, eventId, participantId, roleType }
	•  MergeAudit { id, targetId, sourceIds[], fieldChanges[], performedBy, performedAt }
	•  Po merge: zachowaj referencje do sourceIds (historyczne identyfikatory) — przydaje się dla audytu i rewizji.

7) Kwestie techniczne i decyzje projektowe

	•  Czy personalId ma być unikalny w DB? Jeśli ustawisz constraint UNIQUE -> DB zablokuje duplikaty (błędne przy workflow sugerowania). Lepsze: nie wymuszać unikalności na poziomie DB, tylko indeks + logika aplikacji. Alternatywnie: enforce uniqueness ale przy ingestii danych z możliwością "on conflict do merge" (zależnie od DB).
	•  Czy merge ma być automatyczny czy ręczny? Rekomendacja: ręczny z sugestią, bo automatyczny może błędnie połączyć różnych ludzi (ryzyko prawne).
	•  Soft-delete vs fizyczne usuwanie: preferuj soft-delete i zachowanie źródeł jako „merged” z linkiem do target, by umożliwić rollback.
	•  Transakcje i równoczesne edycje: użyj row-level locking lub optimistic locking (version field) przy merge by zapobiec utracie danych.
	•  Pełna audytowalność: kto i kiedy połączył, jakie pola zmieniono.

8) Edge-cases i testy akceptacyjne Najważniejsze scenariusze:

	•  Tworzenie nowego uczestnika z personalId, istnieje dokładne dopasowanie -> system proponuje merge (expected: sugestia visible).
	•  Tworzenie z personalId różnym -> brak sugestii.
	•  Ręczne łączenie dwóch rekordów z różnymi polami -> wszystkie powiązania (role/zdarzenia) są przeniesione do rekordu target.
	•  Merge kiedy target lub source ma brakujące pola -> strategia preferNonNull zachowuje pełne dane.
	•  Próba merge kiedy inny operator równolegle edytuje -> concurrency control wykrywa konflikt i odmowa/ponowienie.
	•  PersonalId null/empty -> nie sugerować merge po id; użyć fuzzy match lub nie sugerować wcale.
	•  RODO: osoby żądają usunięcia — co z recordami merged? Polityka: anoni​mizacja lub usunięcie danych osobowych, ale audyt/relacje zachować minimalnie (np. pseudonimizacja).

Przykładowe przypadki testowe (automatyczne):

	•  UT1: create participant A, create participant B with same personalId => GET /participants?suggestByPersonalId returns B as suggestion.
	•  UT2: merge A into B with preferNonNull -> all roles now reference B, A.status == MERGED, audit entry created.
	•  UT3: concurrent merge attempt -> second attempt fails with 409 and message about concurrent modification.

9) Bezpieczeństwo i RODO

	•  PersonalId = PII — szyfruj go w spoczynku i ogranicz dostęp; loguj kto i kiedy zobaczył pełne dane.
	•  Przy merge operacje traktuj jako modyfikacje PII — rejestruj consent i powody.
	•  Przy żądaniu usunięcia (right to be forgotten) implementuj procedurę: jeśli rekord został zmerged, usuń/anonymizuj dane osobowe ze wszystkich źródeł (zgodnie z polityką) i zaktualizuj audyt (pseudonimizacja, niekoniecznie fizyczne usuwanie audytu).

10) Kryteria akceptacji (konkretne)

	•  Po utworzeniu uczestnika z personalId, jeśli istnieje inny rekord z tym personalId, UI pokazuje sugestię merge.
	•  Merge przenosi wszystkie powiązania (role, event links) na docelowy rekord.
	•  Merge zapisuje audit entry (sourceIds, targetId, fieldChanges, who, when).
	•  Po merge, rekordy źródłowe są oznaczone jako MERGED (soft-delete) i nie są widoczne na listach aktywnych, ale są dostępne w historii.
	•  Możliwość cofnięcia merge (rekonwersja) w window/trybie admins (opcjonalne).

11) Szybkie decyzje rekomendowane

	•  Preferuj ręczne zatwierdzanie merge z UI porównania.
	•  Nie wprowadzaj DB UNIQUE constraint na personalId jeśli potrzebujesz workflow „sugestii” — zamiast tego zakładaj indeks i logikę aplikacji.
	•  Zawsze twórz audit log i soft-delete.
	•  Dodaj testy integracyjne sprawdzające przenoszenie relacji.
 */
}
