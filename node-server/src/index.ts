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
        console.log('Keys in A:', keysInA);
        const keysInB = new Set(arrayB.map(item => item[keyB]));
        console.log('Keys in B:', keysInB);
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

type Developer1 = { id: number; name: string };
type SafeExtractIds<T extends readonly { id: number }[]> = T[number]["id"];
type IntersectionIds<T extends readonly { id: number }[], S extends readonly { id: number }[]> = 
    SafeExtractIds<T> & SafeExtractIds<S>;

// Przykład:
const tablica1 = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] as const;
const tablica2 = [
    { id: 2, name: 'B' }, 
    { id: 3, name: 'C' },  
] as const;

type WspolneID = IntersectionIds<typeof tablica1, typeof tablica2>;
type WSP<T extends readonly { id: number }[], S extends readonly { id: number }[]> = T[number]["id"] & S[number]["id"];
 const y: WSP<typeof tablica1, typeof tablica2> = 2; // Poprawne, bo 2 jest wspólnym ID
const pracownicy = [
    { id: 1, imie: 'Jan' },
    { id: 2, imie: 'Anna' },
    { id: 3, imie: 'Piotr' }
] as { id: number | null; imie: string | null }[];

const samochody = [
    { id_auta: 2, model: 'Toyota' },
    { id_auta: 3, model: 'Ford' },
    { id_auta: 4, model: "BMW" }
] as { id_auta: number | null; model: string | null }[];

// Model nie jest w tablicy Col, więc v.model będzie typu never
const v: FJ<typeof pracownicy, typeof samochody, ['id', 'imie', 'id_auta'], 1> = {
    id: 0,
    imie: 'Jan',
    id_auta: null,
    model: undefined as never // model został wykluczony przez brak w Col
};

    function fj<A extends Record<string, any>, B extends Record<string, any>>(
        arrayA: A[],
        arrayB: B[],
        keyA: keyof A,
        keyB: keyof B
    ) {
        // 1. Wyciągamy wszystkie unikalne klucze z obu tablic do Setów
        const keysInA = new Set(arrayA.map(item => item[keyA]));
        console.log('Keys in A:', keysInA);
        const keysInB = new Set(arrayB.map(item => item[keyB]));
        console.log('Keys in B:', keysInB);
        // 2. Filtrujemy tablicę A: zostawiamy tylko te elementy, których klucza NIE MA w B
        const onlyInA = arrayA.filter((item: any) => !keysInB.has(item[keyA]));

        // 3. Filtrujemy tablicę B: zostawiamy tylko te elementy, których klucza NIE MA w A
        const onlyInB = arrayB.filter((item: any) => !keysInA.has(item[keyB]));

        // Map onlyInA to add keyB: null
        const arra = onlyInA.map((t) => ({ ...t, [keyB]: null }));
        // Map onlyInB to add keyA: null
        const arrb = onlyInB.map((t) => ({ ...t, [keyA]: null }));
        // 4. Zwracamy jedną tablicę (odpowiednik kolumn A i B z wartościami NULL w SQL)
        return [...arra, ...arrb] as Array<FJ<A[], B[]>>;
    }
    const wynik = fullAntiJoin(pracownicy, samochody, 'id', 'id_auta');
    const wynik1 = fj(pracownicy, samochody, 'id', 'id_auta')




    console.log(wynik1);

    const developers = [
        {
            "first_name": "Steven",
            "last_name": "Martin",
            "level": "junior",
            "years_experience": 2,
            "rank": 1
        },
        {
            "first_name": "Jack",
            "last_name": "Davis",
            "level": "junior",
            "years_experience": 1,
            "rank": 2
        },
        {
            "first_name": "Megan",
            "last_name": "Stevens",
            "level": "junior",
            "years_experience": 1,
            "rank": 2
        },
        {
            "first_name": "Helen",
            "last_name": "Brown",
            "level": "junior",
            "years_experience": 0,
            "rank": 4
        },
        {
            "first_name": "Max",
            "last_name": "Weber",
            "level": "mid-level",
            "years_experience": 4,
            "rank": 1
        },
        {
            "first_name": "Nick",
            "last_name": "Jackson",
            "level": "mid-level",
            "years_experience": 3,
            "rank": 2
        },
        {
            "first_name": "Sophia",
            "last_name": "Moore",
            "level": "mid-level",
            "years_experience": 3,
            "rank": 2
        },
        {
            "first_name": "Alex",
            "last_name": "Miller",
            "level": "senior",
            "years_experience": 8,
            "rank": 1
        },
        {
            "first_name": "John",
            "last_name": "Jones",
            "level": "senior",
            "years_experience": 5,
            "rank": 2
        },
        {
            "first_name": "Kate",
            "last_name": "Williams",
            "level": "senior",
            "years_experience": 4,
            "rank": 3
        }
    ]



    type Developer = typeof developers[number];

    type Rank<T> = T & { ranking: number };




    const mr = <T extends Developer>(arr: T[], selectedCol: keyof T): Rank<T>[] => {
        // 1. Grupowanie/Zliczanie wystąpień wartości w wybranej kolumnie
        const counts = arr.reduce((acc, item) => {
            const val = String(item[selectedCol]);
            acc[val] = (acc[val] || 0) + 1;
            console.log(`Counting value "${val}": current count is ${acc[val]}`);
            return acc;
        }, {} as Record<string, number>);

        // 2. Mapowanie tablicy na RankType z dodanym rankingiem na podstawie zliczeń
        return arr.map(item => ({
            ...item,
            ranking: counts[String(item[selectedCol])] // tutaj przypisujemy "ranking" (np. liczbę osób na tym samym poziomie)
        }));
    };

    mr(developers, 'level')






    console.log(`Server running on http://localhost:${PORT}`);

});





//  type Duplikaty<T extends Record<string, string>[],
//  S extends Record<string, string>[]=[]> = T extends (infer U)[S[number]] ? U : never;




// 1. Zdefiniuj strukturę wyniku


