package com.eventsRegistry.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@DiscriminatorValue("Generic")
public class GenericRoleEntity extends ParticipantRoleEntity {
    private String roleName;
    private String canonicalType;
    private boolean unknownFlag = true;

    @ElementCollection
    @CollectionTable(name = "generic_role_metadata", joinColumns = @JoinColumn(name = "role_id"))
    @MapKeyColumn(name = "meta_key")
    @Column(name = "meta_value", length = 2000)
    private Map<String, String> metadata = new HashMap<>();

    private String source;
    private Double confidence;
    private LocalDateTime detectedAt;
    @Column(length = 4000)
    private String originalPayload;

    public GenericRoleEntity() {
        this.detectedAt = LocalDateTime.now();
    }

    // getters / setters
    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

    public String getCanonicalType() { return canonicalType; }
    public void setCanonicalType(String canonicalType) { this.canonicalType = canonicalType; }

    public boolean isUnknownFlag() { return unknownFlag; }
    public void setUnknownFlag(boolean unknownFlag) { this.unknownFlag = unknownFlag; }

    public Map<String, String> getMetadata() { return metadata; }
    public void setMetadata(Map<String, String> metadata) { this.metadata = metadata; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }

    public String getOriginalPayload() { return originalPayload; }
    public void setOriginalPayload(String originalPayload) { this.originalPayload = originalPayload; }
}
