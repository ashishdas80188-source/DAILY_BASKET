package com.dailybasket.service;

import com.dailybasket.dto.AddressDTO;
import com.dailybasket.dto.AddressRequest;
import com.dailybasket.dto.UserDTO;
import com.dailybasket.dto.UserProfileUpdateRequest;
import com.dailybasket.entity.Address;
import com.dailybasket.entity.User;
import com.dailybasket.exception.BadRequestException;
import com.dailybasket.exception.ResourceNotFoundException;
import com.dailybasket.repository.AddressRepository;
import com.dailybasket.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       AddressRepository addressRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO getProfile(String email) {
        User user = getUserByEmail(email);
        return mapToUserDTO(user);
    }

    @Transactional
    public UserDTO updateProfile(String email, UserProfileUpdateRequest request) {
        User user = getUserByEmail(email);
        user.setFullName(request.getFullName());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password is required and must match to set a new password.");
            }
            if (request.getNewPassword().length() < 6) {
                throw new BadRequestException("New password must be at least 6 characters.");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User updated = userRepository.save(user);
        return mapToUserDTO(updated);
    }

    public List<AddressDTO> getUserAddresses(String email) {
        User user = getUserByEmail(email);
        return addressRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToAddressDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDTO addAddress(String email, AddressRequest request) {
        User user = getUserByEmail(email);

        List<Address> existing = addressRepository.findByUserId(user.getId());
        if (request.isDefault() || existing.isEmpty()) {
            existing.forEach(a -> a.setDefault(false));
            addressRepository.saveAll(existing);
        }

        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreetAddress(request.getStreetAddress());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPinCode(request.getPinCode());
        address.setAddressType(request.getAddressType() != null ? request.getAddressType() : "HOME");
        address.setDefault(request.isDefault() || existing.isEmpty());

        Address saved = addressRepository.save(address);
        return mapToAddressDTO(saved);
    }

    @Transactional
    public AddressDTO updateAddress(String email, Long addressId, AddressRequest request) {
        User user = getUserByEmail(email);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to this address");
        }

        if (request.isDefault()) {
            List<Address> existing = addressRepository.findByUserId(user.getId());
            existing.forEach(a -> a.setDefault(false));
            addressRepository.saveAll(existing);
        }

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreetAddress(request.getStreetAddress());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPinCode(request.getPinCode());
        address.setAddressType(request.getAddressType());
        address.setDefault(request.isDefault());

        Address updated = addressRepository.save(address);
        return mapToAddressDTO(updated);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = getUserByEmail(email);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to this address");
        }

        addressRepository.delete(address);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public UserDTO mapToUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }

    public AddressDTO mapToAddressDTO(Address a) {
        AddressDTO dto = new AddressDTO();
        dto.setId(a.getId());
        dto.setFullName(a.getFullName());
        dto.setPhone(a.getPhone());
        dto.setStreetAddress(a.getStreetAddress());
        dto.setLandmark(a.getLandmark());
        dto.setCity(a.getCity());
        dto.setState(a.getState());
        dto.setPinCode(a.getPinCode());
        dto.setAddressType(a.getAddressType());
        dto.setDefault(a.isDefault());
        return dto;
    }
}
