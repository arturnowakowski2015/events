public interface IRole {
    String getRoleName(); // e.g., "Perpetrator", "Victim"
    String getDescription();
	void setRoleName(String rl);
}