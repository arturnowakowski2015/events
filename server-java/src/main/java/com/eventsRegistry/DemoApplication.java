package com.eventsRegistry;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.eventsRegistry.model.Participant;


import java.util.Date;

//Klasa Para (odpowiednik Y<U, V>)
class Para<U, V> {
 U klucz;
 V wartosc;

 Para(U klucz, V wartosc) {
     this.klucz = klucz;
     this.wartosc = wartosc;
 }

 @Override
 public String toString() {
     return "[" + klucz + " : " + wartosc + "]";
 }
}

//Klasa Historia (odpowiednik wewnętrznego E)
class Historia<T> {
 T wpis;
 String typOperacji;

 Historia(T wpis, String typ) {
     this.wpis = wpis;
     this.typOperacji = typ;
 }

 @Override
 public String toString() {
     return "Operacja: " + typOperacji + " -> Dane: " + wpis;
 }
}

//Klasa Klient (odpowiednik zewnętrznego E)
class Klient<T, H> {
 T daneOsobiste;
 H szczegolyHistorii;

 Klient(T dane, H historia) {
     this.daneOsobiste = dane;
     this.szczegolyHistorii = historia;
 }

 @Override
 public String toString() {
     return "KLIENT:\n Dane: " + daneOsobiste + "\n Ostatnia " + szczegolyHistorii;
 }
}

class BankApp {
	public static void addFirstAndLast(List<Integer> list) {
    int last = list.get(0)+list.get(list.size()-1);
    System.out.println(last);
}
}





@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		Map<String, List<Long>> map = new HashMap<>();
		map.put("S", Arrays.asList(5L, 8L, 9L));
		map.put("d", Arrays.asList(5L));
		map.put("b", Arrays.asList(9L));

		List<Long> list = map.getOrDefault("S", Arrays.asList());
		System.out.println("Values for S: " + list);

		Map<String, List<Long>> all = map.entrySet().stream()
			.filter(t -> t.getKey().contains("a"))
			.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
		System.out.println("All values: " + all);

		List<Long> allValues = map.entrySet().stream()
			.filter(t -> t.getKey().contains("a"))
			.flatMap(e -> e.getValue().stream())
			.collect(Collectors.toList());

		String tekst = "Jabłko,Banan,Pomarańcza";
		// create a mutable List<String> from the array returned by split
		List<String> owoce = new ArrayList<>(Arrays.asList(tekst.split(",")));
		

		List<String> sentences = List.of(
			    "Java to super język.",
			    "Java jest szybka,",
			    "i Java jest bardzo popularna."
			);
		sentences.stream().collect(Collectors.joining());
		sentences.stream().map(t->t.replaceAll("[.,]", ""));
		Set<String> set = new TreeSet();
		System.out.println("Owoce: " + owoce);
	      long card = 1234123412341234L;
	      String str="";
	      String val=String.valueOf(Math.abs(card));
	      System.out.println("DEBUG: Liczba to: " + val);
	      System.out.println("DEBUG: Długość to: " + val.length());
	      if (val.length() == 16) {
	    	    System.out.println("Sukces: " + card);
	    	    for(long i=0; i<12; i++) {
	  	    	  str+="*";
	  	      		if(i%4==0)str+="-";
	  	      }
	    	} else {
	    	    // Dodaj "card" do komunikatu:
	    	    throw new IllegalArgumentException("Błąd! Ta liczba jest zła: " + card + " (długość: " + String.valueOf(Math.abs(card)).length() + ")");
	    	}
	      System.out.println(str);;
	      
	      
	       
	      int l = 175;
	      int suma=0;
	      String str1 = String.valueOf(l);
	      for(int i=0;i<str1.length();i++) {
	    	  suma+=Math.pow( str1.charAt(i-0),i+1);
	      }
	      System.out.println(l+":::"+suma);
//	      Wejście: "12345678901234567890123456"
//	    	  Wyjście: "12 3456 7890 1234 5678 9012 3456"
	      String rawAccount = "12345678901234567890123456";
	      String formatted = "";

	      for (int i = 0; i < rawAccount.length(); i++) {
	          formatted += rawAccount.charAt(i);
	          
	          // TWOJE ZADANIE:
	          // 1. Spacja musi być po 2. znaku (indeks 1)
	          // 2. Potem spacja musi być co 4 znaki (6., 10., 14. itd.)
	          // 3. Nie dodawaj spacji na samym końcu
	          
	          if ( ((i+1)%4==0 || i==3) && i<rawAccount.length()-1 ) {
	              formatted += " ";
	          }
	      }
	      System.out.println(formatted);
 
 
	     String sent = "acesvnmuoi";
	     StringBuilder sb = new StringBuilder(sent);

	     for (int i = 0; i < sb.length(); i++) {
	         // Twój warunek: i > 1 oraz co druga litera (indeksy 2, 4, 6...)
	         if (i > 1 && (i - 3) % 2 == 0) {
	             // Pobieramy literę, zmieniamy na dużą i wkładamy z powrotem
	             char upper = Character.toUpperCase(sb.charAt(i));
	             sb.setCharAt(i, upper);
	         }
	     }
	     System.out.println(sb.toString()); 
	}

}