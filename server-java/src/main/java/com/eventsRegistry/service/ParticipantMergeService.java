package com.eventsRegistry.service;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.eventsRegistry.model.Participant;
import com.eventsRegistry.model.GenericRole;
import com.eventsRegistry.model.IRole;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ParticipantMergeService {
    private final Map<String, Participant> store = new LinkedHashMap<>();

    public ParticipantMergeService() {
        // create deterministic sample keys so frontend can reference them
        Participant p1 = new Participant("Jan","Kowalski","ABC123456");
        p1.addRole(new GenericRole("Victim", "Victim (e-1)"));
        p1.addRole(new GenericRole("Witness", "Witness (e-2)"));
        store.put("p-100", p1);

        Participant p2 = new Participant("Janusz","Kowalski","ABC123456");
        p2.addRole(new GenericRole("Perpetrator", "Perpetrator (e-3)"));
        store.put("p-999", p2);

        Participant p3 = new Participant("Jan","Kowalski","ABC123456");
        p3.addRole(new GenericRole("Officer", "Officer (e-4)"));
        store.put("p-500", p3);
    }

    public List<Map<String,Object>> listAllAsMap() {
        List<Map<String,Object>> out = new ArrayList<>();
        for(Map.Entry<String,Participant> e: store.entrySet()){
            out.add(participantToMap(e.getKey(), e.getValue()));
        }
        return out;
    }
 
    public List<Map<String,Object>> findByPersonalId(String personalId) {
        if(personalId == null || personalId.isEmpty()) return listAllAsMap();
        List<Map<String,Object>> out = new ArrayList<>();
        for(Map.Entry<String,Participant> e: store.entrySet()){
            Participant p = e.getValue();
            if(personalId.equals(p.getPersonalId())) out.add(participantToMap(e.getKey(), p));
        }
        return out;
    }
    public List<Map<String, Object>> findByLastNamePrefix(String prefix) {
         if(prefix==null || prefix.isEmpty())return this.listAllAsMap();
         	List<Map<String, Object>> list = new ArrayList<>();
         for(Map.Entry<String,Participant> e: store.entrySet())
        {
        	Participant p = e.getValue();
        	if(p.getFirstName().startsWith(prefix))
			list.add(this.participantToMap(e.getKey(), p));
        }
        return list; 
    }
    
    
 
    
    public Map<String,Object> merge(String targetId, List<String> sourceIds, Map<String,String> fieldResolution) {
        // basic parameter checks
        if (targetId == null || targetId.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetId is required");
        }

        Participant target = store.get(targetId);
        if (target == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Target not found: " + targetId);
        }

        // normalize sourceIds to non-null list
        if (sourceIds == null) {
            sourceIds = List.of();
        }

        // ensure targetId is NOT in sourceIds
        if (sourceIds.contains(targetId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sourceIds must not contain targetId: " + targetId);
        }

        // ensure all sourceIds exist in the store
        List<String> missingSources = sourceIds.stream()
                .filter(sid -> !store.containsKey(sid))
                .collect(Collectors.toList());
        if (!missingSources.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some sourceIds not found: " + missingSources);
        }

        // allowed ids for fieldResolution are { targetId } U sourceIds
        Set<String> allowed = new HashSet<>(sourceIds);
        allowed.add(targetId);

        if (fieldResolution != null) {
            for (Map.Entry<String, String> fr : fieldResolution.entrySet()) {
                String field = fr.getKey();
                String chosenId = fr.getValue();
                if (chosenId == null || !allowed.contains(chosenId)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "fieldResolution contains unknown id for field '" + field + "': " + chosenId
                    );
                }
            }
        }

        // apply fieldResolution: map field -> chosenId (now validated)
        if (fieldResolution != null) {
            for (Map.Entry<String, String> fr : fieldResolution.entrySet()) {
                String field = fr.getKey();
                String chosenId = fr.getValue();
                Participant chosen = store.get(chosenId); // validated above, should exist
                if (chosen == null) continue; // defensive, but normally won't happen
                try {
                    switch (field) {
                        case "firstName":
                            java.lang.reflect.Field fn = com.eventsRegistry.model.Person.class.getDeclaredField("firstName");
                            fn.setAccessible(true);
                            fn.set(target, chosen.getFirstName());
                            break;
                        case "lastName":
                            java.lang.reflect.Field ln = com.eventsRegistry.model.Person.class.getDeclaredField("lastName");
                            ln.setAccessible(true);
                            ln.set(target, chosen.getLastName());
                            break;
                        case "personalId":
                            java.lang.reflect.Field pid = com.eventsRegistry.model.Person.class.getDeclaredField("personalId");
                            pid.setAccessible(true);
                            pid.set(target, chosen.getPersonalId());
                            break;
                        default:
                            // ignoruj nieznane pola (lub loguj)
                            break;
                    }
                } catch (Exception ex) {
                    // w demo ignorujemy, ale w produkcji loguj/obsłuż wyjątek
                }
            }
        }

        // merge roles from sources
        for (String sid : sourceIds) {
            Participant src = store.get(sid);
            if (src == null) continue; // should not happen after validation
            for (IRole r : src.getRoles()) {
                target.addRole(r);
            }
            // soft-remove source (w tym demo usuwamy z mapy)
            store.remove(sid);
        }

        return participantToMap(targetId, target);
    }

    
    
    

    private Map<String,Object> participantToMap(String key, Participant p){
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", key);
        m.put("firstName", p.getFirstName());
        m.put("lastName", p.getLastName());
        m.put("personalId", p.getPersonalId());
        List<Map<String,String>> roles = new ArrayList<>();
        List<IRole> roleList = p.getRoles();
        if(roleList != null){
            for(IRole r: roleList){
                Map<String,String> rm = new HashMap<>();
                rm.put("description", r.getDescription());
                rm.put("roleName", r.getRoleName()!=null ? r.getRoleName() : "");
                roles.add(rm);
            }
        }
        m.put("roles", roles);
        return m;
    }
}