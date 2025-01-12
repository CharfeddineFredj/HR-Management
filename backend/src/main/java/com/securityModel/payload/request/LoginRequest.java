package com.securityModel.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LoginRequest {


	private String username;

	@NotBlank
	private String password;


	private String email;



	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	public boolean isValid() {
		return (this.username != null && !this.username.isEmpty()) ||
				(this.email != null && !this.email.isEmpty());
	}
}
