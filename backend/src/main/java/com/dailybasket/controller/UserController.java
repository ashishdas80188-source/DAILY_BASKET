package com.dailybasket.controller;

import com.dailybasket.dto.AddressDTO;
import com.dailybasket.dto.AddressRequest;
import com.dailybasket.dto.ApiResponse;
import com.dailybasket.dto.UserDTO;
import com.dailybasket.dto.UserProfileUpdateRequest;
import com.dailybasket.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(Authentication authentication) {
        UserDTO user = userService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(Authentication authentication,
                                                             @Valid @RequestBody UserProfileUpdateRequest request) {
        UserDTO user = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", user));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressDTO>>> getAddresses(Authentication authentication) {
        List<AddressDTO> addresses = userService.getUserAddresses(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressDTO>> addAddress(Authentication authentication,
                                                             @Valid @RequestBody AddressRequest request) {
        AddressDTO address = userService.addAddress(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address added successfully", address));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<AddressDTO>> updateAddress(Authentication authentication,
                                                                @PathVariable Long id,
                                                                @Valid @RequestBody AddressRequest request) {
        AddressDTO address = userService.updateAddress(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", address));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(Authentication authentication,
                                                          @PathVariable Long id) {
        userService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }
}
