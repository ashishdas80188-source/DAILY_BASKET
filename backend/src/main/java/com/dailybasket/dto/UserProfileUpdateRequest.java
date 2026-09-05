package com.dailybasket.dto;

import jakarta.validation.constraints.NotBlank;

public class UserProfileUpdateRequest {
    @NotBlank(message = "Full name cannot be empty")
    private String fullName;
    private String phone;
    private String currentPassword;
    private String newPassword;

    public UserProfileUpdateRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
