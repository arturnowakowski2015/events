package com.eventsRegistry.dto;

public class RoleDTO {
    private String roleName;
    private String description;

    public RoleDTO() {}

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
