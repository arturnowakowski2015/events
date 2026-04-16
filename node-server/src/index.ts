import express from 'express';
import cors from 'cors';
import incidentRouter from './controllers/incidentController';
import participantRouter from './controllers/participantController';
import type { NextFunction, Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
        if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return callback(null, true);
        return callback(new Error('CORS origin not allowed'));
    },
}));
app.use(express.json());

app.use('/api/incidents', incidentRouter);
app.use('/api/participants', participantRouter);

// NEW (mid): explicit not-found handler for all unmapped routes.
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// NEW (mid): centralized error handler with safe response shape.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});



app.listen(PORT, () => {



    const jestPromise = async () => new Promise(() => {
        try {
            setTimeout(() => {
                console.log("1!");

            }, 1000);
        } catch (err) {
            console.error("Error in jestPromise:", err);
        }
    });
    const jestPromise2 = async () => new Promise(() => {
        try {
            setTimeout(() => {
                console.log("2!");

            }, 1000);
        } catch (err) {
            console.error("Error in jestPromise:", err);
        }
    });

    const test = async () => {
        await jestPromise2(); // Kod zatrzymuje się tutaj na 2 sekundy!
        await jestPromise(); // Kod zatrzymuje się tutaj na 2 sekundy!

        console.log("To wypisze się DOPIERO PO słowie Koniec!");
    };

    test();











    function fullAntiJoin<A extends Record<string, any>, B extends Record<string, any>>(
        arrayA: A[],
        arrayB: B[],
        keyA: keyof A,
        keyB: keyof B
    ) {
        // 1. Wyciągamy wszystkie unikalne klucze z obu tablic do Setów
        const keysInA = new Set(arrayA.map(item => item[keyA]));
        const keysInB = new Set(arrayB.map(item => item[keyB]));

        // 2. Filtrujemy tablicę A: zostawiamy tylko te elementy, których klucza NIE MA w B
        const onlyInA = arrayA.filter((item: any) => !keysInB.has(item[keyA]));

        // 3. Filtrujemy tablicę B: zostawiamy tylko te elementy, których klucza NIE MA w A
        const onlyInB = arrayB.filter((item: any) => !keysInA.has(item[keyB]));

        // 4. Zwracamy obiekt z dwiema tablicami (odpowiednik kolumn A i B z wartościami NULL w SQL)
        return {
            onlyInA,
            onlyInB
        };
    }


    const pracownicy = [
        { id: 1, imie: 'Jan' },
        { id: 2, imie: 'Anna' },
        { id: 3, imie: 'Piotr' }
    ];

    // Tabela B (Samochody)
    const samochody = [
        { id_auta: 2, model: 'Toyota' },
        { id_auta: 3, model: 'Ford' },
        { id_auta: 4, model: 'BMW' }
    ];

    const wynik = fullAntiJoin(pracownicy, samochody, 'id', 'id_auta');

    console.log(wynik);



























    type CommonKeysWithSeparateTypes<O, O1> = {
        [K in keyof (O | O1)]: O[K] | O1[K];
    };

    // PRZYKŁAD UŻYCIA:
    type O = { id: number; name: string; age: number };
    type O1 = { id: string; name: string; city: string };

    type Wynik = CommonKeysWithSeparateTypes<O, O1>;


    type foo = {
        name: string
        age: string
    }
    type coo = {
        age: number
        sex: string
    }

    type Result = Merge<foo, coo> // expected to be {name: string, age: number, sex: string}
    type Merge<T, F> = {
        [K in keyof T | keyof F]: K extends keyof F
        ? F[K]
        : K extends keyof T
        ? T[K]
        : never;
    };





    type User = { imie: string, nazwisko: string, wiek: number };

    type UserById = Record<number, User>;
    type UserWithoutId = Omit<User, 'imie'>;
    type UserName = Pick<User, 'imie'>
    const u: UserById = {
        1: { imie: 'Jan', nazwisko: 'Kowalski', wiek: 30 },
        2: { imie: 'Anna', nazwisko: 'Nowak', wiek: 25 },
    };

    type T2 = Extract<'a' | 'b' | 'c', 'a' | 'b' | "f">; // "a" | "b"
    type T3 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>; // "c"

    type MyOmit<T, K extends keyof T> = { [P in keyof T as P extends K ? never : P]: T[P] };

    type RequiredKeys<T> = {
        [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
    }[][number];
    type r = RequiredKeys<{ a: number; b?: string; c: boolean | undefined }>    // "a" | "c"





    const dane: Transakcja[] = [
        { id: 101, zmiana: 100 },
        { id: 102, zmiana: -20 }
    ];

    function obliczKumulacje<T, R>(
        dane: T[],
        wartoscPoczatkowa: R,
        akumulator: (poprzedni: R, aktualny: T) => R
    ): R[] {
        let obecnyStan = wartoscPoczatkowa;

        return dane.map((element) => {
            obecnyStan = akumulator(obecnyStan, element);
            return obecnyStan;
        });
    }

    // TS automatycznie przypisze T = Transakcja, R = PunktWykresu
    const historia = obliczKumulacje(
        dane,
        { tId: 0, total: 0 },
        (acc, t) => ({
            tId: t.id,
            total: acc.total + t.zmiana
        })
    );

    interface Transakcja {
        id: number;
        zmiana: number;
    }

    interface PunktWykresu {
        tId: number;
        total: number;
    }


    const transakcje = [
        { id: 1, waluta: "USD", zmiana: 1000, opis: "Wpłata" },
        { id: 2, waluta: "USD", zmiana: -200, opis: "Zakup" },
        { id: 3, waluta: "USD", zmiana: 550, opis: "Sprzedaż" },
        { id: 4, waluta: "USD", zmiana: -100, opis: "Opłata" }
    ];
    type Transakcja1 = keyof typeof transakcje[number];
    const l: Transakcja1[] = ["id", "waluta", "zmiana", "zmiana"]
    type StanPortfela = number[];
    // Używaj kodu z rozwagą.
    // 2. Dane wyjściowe (Output)
    // Tablica liczb (lub obiektów), która pokazuje stan portfela po każdym kroku. Jest to tzw. "running total".
    // typescript
    const wynik11 = [
        1000, // Stan po 1. transakcji (0 + 1000)
        800,  // Stan po 2. transakcji (1000 - 200)
        1350, // Stan po 3. transakcji (800 + 550)
        1250  // Stan po 4. transakcji (1350 - 100)
    ];
    type U1 = { step: number }
    function sum<T>(arr: T[], wyniks: (r: number, el: T) => U1): U1[] {
        const suma: U1[] = [];
        let r = 0;

        arr.map(t => {
            const result = wyniks(r, t); // 1. Pobierz wynik (np. obiekt { step: 1000 })
            suma.push(result);           // 2. Dodaj go do tablicy wyników


            r = result.step;

        });

        return suma;
    }

    const transakcjew = [{ zmiana: 1000 }, { zmiana: -200 }, { zmiana: 550 }, { zmiana: -100 }];
    const wynikw = sum(transakcjew, (r, t) => ({ step: r + t.zmiana }));

    console.log(wynikw);
    // Wypisze: [{ step: 1000 }, { step: 800 }, { step: 1350 }, { step: 1250 }]

    const userSignups = [
        { date: "2023-01-03", count: 15 },
        { date: "2023-01-01", count: 10 },
        { date: "2023-01-04", count: 40 },
        { date: "2023-01-02", count: 25 },
    ];

    // 2. Przygotowanie danych (Ordering)
    // Prawdziwa agregacja uporządkowana musi zacząć od sortowania
    const sortedSignups = [...userSignups].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 3. Zastosowanie Twojej funkcji (Window Function Logic: Running Total)
    type U = { step: number, date: string };

    const cumulativeGrowth = sum(sortedSignups, (r, t) => ({
        step: r + t.count,
        date: t.date
    }));

    console.log("Cumulative User Growth:");
    console.table(cumulativeGrowth);



    type WindowState = {
        step: number;     // Aktualna średnia
        history: number[] // Bufor przechowujący ostatnie wartości
    };

    function movingAverage<T>(arr: T[], getValue: (el: T) => number, windowSize: number): WindowState[] {
        const results: WindowState[] = [];
        let history: number[] = [];

        arr.forEach(t => {
            const val = getValue(t);

            // 1. Dodaj nową wartość do historii
            history.push(val);

            // 2. Jeśli historia jest większa niż okno, usuń najstarszy element
            if (history.length > windowSize) {
                history.shift();
            }

            // 3. Oblicz średnią z obecnego okna
            const currentSum = history.reduce((a, b) => a + b, 0);
            const average = currentSum / history.length;

            results.push({
                step: Number(average.toFixed(2)), // Zaokrąglamy dla czytelności
                history: [...history]             // Kopia historii dla podglądu
            });
        });

        return results;
    }

    // Dane: Sprzedaż dzienna
    const sales = [
        { day: "Pn", amount: 100 },
        { day: "Wt", amount: 200 },
        { day: "Śr", amount: 300 }, // Tu średnia z 3 dni: (100+200+300)/3 = 200
        { day: "Cz", amount: 400 }, // Tu średnia z 3 dni: (200+300+400)/3 = 300
        { day: "Pt", amount: 500 }  // Tu średnia z 3 dni: (300+400+500)/3 = 400
    ];

    const result = movingAverage(sales, (s) => s.amount, 3);
    console.table(result);




    console.log(`Server running on http://localhost:${PORT}`);

});





//  type Duplikaty<T extends Record<string, string>[],
//  S extends Record<string, string>[]=[]> = T extends (infer U)[S[number]] ? U : never;




// 1. Zdefiniuj strukturę wyniku


