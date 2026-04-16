package com.eventsRegistry.model;

import java.time.LocalDateTime;
 import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Generic fallback implementation of IRole for unknown/unmapped role names.
 * Stores original roleName, optional canonicalType, a description and arbitrary metadata.
 */
public class GenericRole extends ParticipantRole implements IRole {
    private String roleName;           // original role name from input
    private String canonicalType;      // normalized/known type if available
    private boolean isUnknown = true;  // true when used as fallback
    private Map<String, Object> metadata = new ConcurrentHashMap <>(); // additional arbitrary properties
    private String source;             // source of data (e.g., "client", "legacyImport")
    private Double confidence;         // optional confidence score (0..1)
    private LocalDateTime detectedAt;  // when this generic role was created/detected
    private String originalPayload;    // optional raw fragment for auditing/debug

    public GenericRole() {
        this.detectedAt = LocalDateTime.now();
    }

    public GenericRole(String roleName, String description) {
        this();
        this.roleName = roleName;
        this.description = description;
    }

    @Override
    public String getRoleName() { return roleName; }

    @Override
    public String getDescription() { return description; }
    
 
    public void setRoleName(String rl) {
    	this.roleName=rl;
    }
    public String getCanonicalType() { return canonicalType; }
    public void setCanonicalType(String canonicalType) { this.canonicalType = canonicalType; }

    public boolean isUnknown() { return isUnknown; }
    public void setUnknown(boolean unknown) { isUnknown = unknown; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }

    public String getOriginalPayload() { return originalPayload; }
    public void setOriginalPayload(String originalPayload) { this.originalPayload = originalPayload; }

    // convenience helpers
    public void putMetadata(String key, Object value) { this.metadata.put(key, value); }
    public <T> T getMetadata(String key, Class<T> type) {
        Object v = metadata.get(key);
        return type.isInstance(v) ? type.cast(v) : null;
    }
 }
